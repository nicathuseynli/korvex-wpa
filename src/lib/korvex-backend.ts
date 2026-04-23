/**
 * Thin HTTP client for the Korvex .NET API's bot-facing endpoints.
 * Same auth mechanism the Telegram bot uses (X-Bot-Secret header).
 *
 * Endpoints:
 *   POST   /api/bot/subscription/create
 *   POST   /api/bot/subscription/{id}/extend
 *   DELETE /api/bot/subscription/{id}
 */

const TIMEOUT_MS = 10_000;

export class BackendError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "BackendError";
    this.status = status;
  }
}

function config() {
  const baseUrl = process.env.KORVEX_BACKEND_URL;
  const secret = process.env.KORVEX_BOT_SECRET;
  if (!baseUrl || !secret) {
    throw new BackendError("Server misconfigured: backend URL/secret missing", 500);
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), secret };
}

async function call<T>(path: string, init: RequestInit): Promise<T> {
  const { baseUrl, secret } = config();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "X-Bot-Secret": secret,
        ...init.headers,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new BackendError(`Backend ${path} failed: ${res.status}`, res.status);
    }
    const text = await res.text();
    return (text ? JSON.parse(text) : {}) as T;
  } catch (err) {
    if (err instanceof BackendError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new BackendError("Backend timeout", 504);
    }
    throw new BackendError("Backend connection failed", 502);
  } finally {
    clearTimeout(timer);
  }
}

export interface CreateSubscriptionResult {
  subscriptionId: string;
  subscriptionUrl: string;
  expiresAt: string;
  success: boolean;
}

export async function createSubscription(params: {
  telegramId: number;
  durationDays: number;
  limitIp: number;
}): Promise<CreateSubscriptionResult> {
  const result = await call<CreateSubscriptionResult>(
    "/api/bot/subscription/create",
    { method: "POST", body: JSON.stringify(params) }
  );
  if (!result.success || !result.subscriptionUrl) {
    throw new BackendError("Backend returned unsuccessful create", 502);
  }
  return result;
}

export async function extendSubscription(params: {
  subscriptionId: string;
  durationDays: number;
}): Promise<{ expiresAt: string }> {
  return call(
    `/api/bot/subscription/${encodeURIComponent(params.subscriptionId)}/extend`,
    { method: "POST", body: JSON.stringify({ durationDays: params.durationDays }) }
  );
}

export async function revokeSubscription(subscriptionId: string): Promise<void> {
  await call(
    `/api/bot/subscription/${encodeURIComponent(subscriptionId)}`,
    { method: "DELETE" }
  );
}
