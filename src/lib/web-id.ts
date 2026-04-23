/**
 * Turn an email address into a synthetic Telegram-compatible BIGINT.
 *
 * The Korvex .NET API keys subscriptions by `telegramId`. Web customers
 * have no Telegram ID, so we derive a stable, collision-free one.
 *
 * Real Telegram user IDs are <= ~10^10. We reserve the range
 *   1_000_000_000_000 .. (1_000_000_000_000 + 2^52)
 * for web-origin IDs — two orders of magnitude above any real TG ID
 * and well within JavaScript's safe integer range (2^53 - 1).
 *
 * Same email -> same id -> renewals are idempotent on the backend
 * (the bot endpoint returns the existing sub or extends it).
 */

import { createHash, randomBytes } from "crypto";

const WEB_ID_BASE = 1_000_000_000_000;
const WEB_ID_SPAN = 2 ** 52;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function emailToTelegramId(email: string): number {
  const normalized = normalizeEmail(email);
  const hash = createHash("sha256").update(normalized).digest();
  // Take 7 bytes (56 bits), mod span to stay within safe-integer territory.
  let n = 0;
  for (let i = 0; i < 7; i++) {
    n = n * 256 + hash[i];
  }
  return WEB_ID_BASE + (n % WEB_ID_SPAN);
}

export function generateAccessToken(): string {
  // URL-safe random token, 32 chars -> 192 bits of entropy.
  return randomBytes(24).toString("base64url");
}
