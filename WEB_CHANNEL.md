# Korvex Web Channel — Email-Delivered Subscriptions

This doc covers only the **web purchase flow** (buy on the website → get a V2Box link by email). It lives alongside the existing activation-key flow and the Telegram bot.

## Flow

```
/pricing → click "Get link via email"
  → /checkout?plan=X  (enter email, pick plan)
  → POST /api/web/checkout
        ├─ validate + rate-limit (per IP and per email)
        ├─ if TEST_MODE=true: skip payment
        ├─ emailToTelegramId(email) → synthetic BIGINT in reserved range
        ├─ POST https://api.media-flow-api.com/api/bot/subscription/create
        │     headers: X-Bot-Secret
        │     body: {telegramId, durationDays, limitIp}
        │     ← {subscriptionId, subscriptionUrl, expiresAt}
        ├─ SQLite: insert {email, subscriptionId, subscriptionUrl, accessToken}
        └─ Resend API: send HTML email with link + QR
  → /success
User clicks "Manage" from the email:
  → /my?token=<opaque access token>
  → GET /api/web/my?token=… returns the sub details (no email exposed in URL)
```

## Why this design

- **No backend changes.** Uses the exact same `/api/bot/subscription/*` endpoints the Telegram bot already calls. Zero risk to the working VPN.
- **Same pricing surface as the bot.** Plans are env-driven; keep `PLAN_PRICE_*` synced with `/opt/korvex-bot/.env`.
- **Idempotent renewals.** `email → telegramId` is deterministic, so the same email re-buying lands on the same user record and the backend extends the existing subscription instead of creating a duplicate.
- **No email in URLs.** The "manage" link uses a 192-bit opaque token.

### Reserved ID range

Web users get synthetic "telegramIds" in the range `[10^12, 10^12 + 2^52)`. Real Telegram IDs are < ~10^10, so collisions are impossible. Stays within JavaScript's safe-integer range.

## Environment

See `.env.example`. Required:

| Var | Why |
| --- | --- |
| `KORVEX_BACKEND_URL` | `.NET` API base. Same as bot's `BACKEND_API_URL`. |
| `KORVEX_BOT_SECRET` | Must equal `Bot.SharedSecret` on the .NET API and `BACKEND_BOT_SECRET` in the bot. |
| `RESEND_API_KEY` | Resend API key. Domain must be verified (SPF + DKIM). |
| `EMAIL_FROM` | From address — `noreply@<verified-domain>`. |
| `PLAN_PRICE_*` | Must match bot's `PRICE_*` to avoid customer confusion. |
| `TEST_MODE` | `true` for the current testing phase (no payment). Set to `false` once a payment provider is wired. |

## Deploy

1. **Pick a domain**, e.g. `app.media-flow-api.com` (already reserved in `MINI_APP_URL`).
2. Point DNS at the web host. Add a Cloudflare origin cert or Let's Encrypt.
3. Verify the `media-flow-api.com` domain in Resend. Add the SPF + DKIM records Resend gives you.
4. Create the dedicated web DB on the Korvex server (one-time):
   ```bash
   sudo -u postgres psql -c "CREATE DATABASE korvex_web OWNER korvex;"
   ```
   Tables (`web_orders`, `web_rate_limits`) are created automatically on first request.
5. On the web host:
   ```bash
   cp .env.example .env.production
   # edit .env.production (especially KORVEX_BOT_SECRET and WEB_DATABASE_URL)
   docker compose up -d --build
   ```
5. Front nginx (or Cloudflare) to `:3000`. Point `app.media-flow-api.com` at it.
6. Smoke test: visit `/checkout`, submit, check email, paste link into V2Box.

## Adding payments later

Payment lives in `src/app/api/web/checkout/route.ts` — the block guarded by `TEST_MODE`. To wire Stripe:

1. Add a `POST /api/web/stripe/webhook` route that verifies the signature.
2. In `/api/web/checkout`, instead of calling `createSubscription()` directly, create a Stripe Checkout Session (plan + email in metadata) and return its URL.
3. The webhook handler calls `createSubscription()` + `upsertOrder()` + `sendSubscriptionEmail()` (exact same three calls the TEST_MODE branch makes today — extract into a helper).

Nothing else changes.

## Files added by this channel

```
src/lib/korvex-backend.ts     HTTP client for /api/bot/subscription/*
src/lib/plans.ts              Plan definitions (env-driven)
src/lib/email.ts              Resend wrapper + HTML template
src/lib/web-id.ts             email → synthetic telegramId
src/lib/web-store.ts          Postgres: web_orders + web_rate_limits
src/app/api/web/plans/…       GET  /api/web/plans
src/app/api/web/checkout/…    POST /api/web/checkout
src/app/api/web/resend/…      POST /api/web/resend
src/app/api/web/my/…          GET  /api/web/my?token=…
src/app/checkout/…            Checkout page + form
src/app/success/…             Post-purchase landing
src/app/my/…                  Link from email (manage sub)
src/app/resend/…              "didn't get the email" self-service
```

Only `src/app/pricing/page.tsx` was **modified** — one "Buy" CTA per plan card. Everything else is additive.
