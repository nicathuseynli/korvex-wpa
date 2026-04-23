/**
 * Local persistence for the web channel — orders + resend rate limiting.
 *
 * Uses a DEDICATED Postgres database (default: `korvex_web`) so the web
 * channel never touches the VPN infra's `korvex` or `korvex_bot` tables.
 * The Korvex .NET API remains the source of truth for subscriptions —
 * this store only tracks email→subscriptionId mapping + access tokens
 * for the "my subscription" page + rate limits for the resend endpoint.
 *
 * Schema is created on first use (idempotent CREATE TABLE IF NOT EXISTS).
 */

import { Pool, type PoolClient } from "pg";

let _pool: Pool | null = null;
let _initPromise: Promise<void> | null = null;

function getPool(): Pool {
  if (_pool) return _pool;
  const connectionString = process.env.WEB_DATABASE_URL;
  if (!connectionString) {
    throw new Error("WEB_DATABASE_URL is not set");
  }
  _pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
  return _pool;
}

async function ensureSchema(client: PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS web_orders (
      id               SERIAL PRIMARY KEY,
      email            TEXT        NOT NULL,
      telegram_id      BIGINT      NOT NULL,
      plan_id          TEXT        NOT NULL,
      subscription_id  TEXT        NOT NULL,
      subscription_url TEXT        NOT NULL,
      access_token     TEXT        NOT NULL UNIQUE,
      expires_at       TIMESTAMPTZ NOT NULL,
      status           TEXT        NOT NULL DEFAULT 'active',
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_web_orders_email ON web_orders(email);
    CREATE INDEX IF NOT EXISTS idx_web_orders_tgid  ON web_orders(telegram_id);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_web_orders_email_sub
      ON web_orders(email, subscription_id);

    CREATE TABLE IF NOT EXISTS web_rate_limits (
      bucket       TEXT        NOT NULL,
      key          TEXT        NOT NULL,
      count        INTEGER     NOT NULL,
      window_start TIMESTAMPTZ NOT NULL,
      PRIMARY KEY (bucket, key)
    );
  `);
}

async function withClient<T>(fn: (c: PoolClient) => Promise<T>): Promise<T> {
  if (!_initPromise) {
    _initPromise = (async () => {
      const c = await getPool().connect();
      try {
        await ensureSchema(c);
      } finally {
        c.release();
      }
    })().catch((err) => {
      _initPromise = null;
      throw err;
    });
  }
  await _initPromise;
  const client = await getPool().connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

export interface OrderRow {
  id: number;
  email: string;
  telegram_id: number;
  plan_id: string;
  subscription_id: string;
  subscription_url: string;
  access_token: string;
  expires_at: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function upsertOrder(params: {
  email: string;
  telegramId: number;
  planId: string;
  subscriptionId: string;
  subscriptionUrl: string;
  accessToken: string;
  expiresAt: string;
}): Promise<OrderRow> {
  return withClient(async (c) => {
    const res = await c.query<OrderRow>(
      `INSERT INTO web_orders
         (email, telegram_id, plan_id, subscription_id, subscription_url, access_token, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email, subscription_id) DO UPDATE SET
         plan_id          = EXCLUDED.plan_id,
         subscription_url = EXCLUDED.subscription_url,
         expires_at       = EXCLUDED.expires_at,
         access_token     = EXCLUDED.access_token,
         status           = 'active',
         updated_at       = NOW()
       RETURNING *`,
      [
        params.email,
        params.telegramId,
        params.planId,
        params.subscriptionId,
        params.subscriptionUrl,
        params.accessToken,
        params.expiresAt,
      ]
    );
    return res.rows[0];
  });
}

export async function getOrderByToken(token: string): Promise<OrderRow | undefined> {
  return withClient(async (c) => {
    const res = await c.query<OrderRow>(
      "SELECT * FROM web_orders WHERE access_token = $1",
      [token]
    );
    return res.rows[0];
  });
}

export async function getLatestOrderByEmail(email: string): Promise<OrderRow | undefined> {
  return withClient(async (c) => {
    const res = await c.query<OrderRow>(
      "SELECT * FROM web_orders WHERE email = $1 ORDER BY created_at DESC LIMIT 1",
      [email]
    );
    return res.rows[0];
  });
}

/**
 * Simple sliding-window rate limit. Returns true if the call is allowed.
 * Uses Postgres row locking for correctness under concurrent requests.
 */
export async function rateLimit(params: {
  bucket: string;
  key: string;
  maxCalls: number;
  windowSeconds: number;
}): Promise<boolean> {
  return withClient(async (c) => {
    await c.query("BEGIN");
    try {
      const existing = await c.query<{ count: number; window_start: string }>(
        "SELECT count, window_start FROM web_rate_limits WHERE bucket = $1 AND key = $2 FOR UPDATE",
        [params.bucket, params.key]
      );

      const now = Date.now();
      const windowStartMs = now - params.windowSeconds * 1000;

      if (existing.rowCount === 0) {
        await c.query(
          "INSERT INTO web_rate_limits (bucket, key, count, window_start) VALUES ($1, $2, 1, NOW())",
          [params.bucket, params.key]
        );
        await c.query("COMMIT");
        return true;
      }

      const row = existing.rows[0];
      const startMs = new Date(row.window_start).getTime();

      if (startMs < windowStartMs) {
        await c.query(
          "UPDATE web_rate_limits SET count = 1, window_start = NOW() WHERE bucket = $1 AND key = $2",
          [params.bucket, params.key]
        );
        await c.query("COMMIT");
        return true;
      }

      if (row.count >= params.maxCalls) {
        await c.query("COMMIT");
        return false;
      }

      await c.query(
        "UPDATE web_rate_limits SET count = count + 1 WHERE bucket = $1 AND key = $2",
        [params.bucket, params.key]
      );
      await c.query("COMMIT");
      return true;
    } catch (err) {
      await c.query("ROLLBACK").catch(() => {});
      throw err;
    }
  });
}
