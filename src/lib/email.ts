/**
 * Email delivery via Resend.
 * Swap for SendGrid/SES by replacing sendMail() — the rest of the app is decoupled.
 */

import QRCode from "qrcode";

export class EmailError extends Error {}

interface SendSubscriptionEmailParams {
  to: string;
  planName: string;
  subscriptionUrl: string;
  expiresAt: string;        // ISO
  manageUrl: string;        // https://app.../my?token=...
  supportUsername?: string; // e.g. @HelpKorvexVPN
}

async function sendMail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Korvex VPN <noreply@media-flow-api.com>";
  if (!apiKey) throw new EmailError("RESEND_API_KEY not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new EmailError(`Resend ${res.status}: ${body.slice(0, 200)}`);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendSubscriptionEmail(
  p: SendSubscriptionEmailParams
): Promise<void> {
  const qrDataUrl = await QRCode.toDataURL(p.subscriptionUrl, {
    margin: 1,
    width: 320,
    color: { dark: "#0a0a0a", light: "#ffffff" },
  });

  const expires = new Date(p.expiresAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#e8e8e8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#111;border:1px solid #222;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:32px 32px 16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#00ff87;letter-spacing:-0.5px;">KORVEX VPN</div>
          <div style="font-size:14px;color:#888;margin-top:4px;">Your subscription is active</div>
        </td></tr>

        <tr><td style="padding:0 32px 24px;">
          <div style="background:#0f1f17;border:1px solid #1a4030;border-radius:12px;padding:20px;">
            <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#00ff87;margin-bottom:4px;">Plan</div>
            <div style="font-size:18px;font-weight:700;">${escapeHtml(p.planName)}</div>
            <div style="font-size:13px;color:#888;margin-top:8px;">Expires <strong style="color:#e8e8e8;">${escapeHtml(expires)}</strong></div>
          </div>
        </td></tr>

        <tr><td style="padding:0 32px 24px;">
          <div style="font-size:13px;color:#aaa;margin-bottom:8px;font-weight:600;">Subscription link (paste into V2Box):</div>
          <div style="background:#0a0a0a;border:1px solid #222;border-radius:8px;padding:14px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;color:#00ff87;word-break:break-all;">${escapeHtml(p.subscriptionUrl)}</div>
        </td></tr>

        <tr><td align="center" style="padding:0 32px 24px;">
          <img src="${qrDataUrl}" alt="Scan to import" width="220" height="220" style="display:block;border-radius:12px;background:#fff;padding:10px;"/>
          <div style="font-size:12px;color:#888;margin-top:8px;">Scan with V2Box to import instantly</div>
        </td></tr>

        <tr><td style="padding:0 32px 24px;">
          <div style="font-size:13px;color:#aaa;line-height:1.6;">
            <strong style="color:#e8e8e8;">How to connect:</strong><br/>
            1. Install V2Box — <a href="https://apps.apple.com/app/v2box-v2ray-client/id6446814690" style="color:#00ff87;">iOS</a> · <a href="https://play.google.com/store/apps/details?id=dev.hexasoftware.v2box" style="color:#00ff87;">Android</a> · <a href="https://v2box.net/" style="color:#00ff87;">Desktop</a><br/>
            2. Tap <strong>+</strong> → <strong>Import from subscription URL</strong><br/>
            3. Paste the link above (or scan the QR)<br/>
            4. Choose a server and connect
          </div>
        </td></tr>

        <tr><td align="center" style="padding:0 32px 32px;">
          <a href="${escapeHtml(p.manageUrl)}" style="display:inline-block;background:#00ff87;color:#0a0a0a;text-decoration:none;font-weight:700;padding:12px 28px;border-radius:10px;font-size:14px;">Manage subscription</a>
        </td></tr>

        <tr><td style="padding:20px 32px;background:#0a0a0a;border-top:1px solid #222;text-align:center;font-size:11px;color:#666;">
          Need help? ${p.supportUsername ? `Write to <a href="https://t.me/${escapeHtml(p.supportUsername.replace(/^@/, ""))}" style="color:#888;">${escapeHtml(p.supportUsername)}</a> on Telegram.` : "Contact support."}<br/>
          Keep the link above private — it grants VPN access.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    "KORVEX VPN — your subscription is active",
    "",
    `Plan: ${p.planName}`,
    `Expires: ${expires}`,
    "",
    "Subscription link (paste into V2Box):",
    p.subscriptionUrl,
    "",
    `Manage: ${p.manageUrl}`,
    "",
    "How to connect:",
    "1. Install V2Box (iOS / Android / Desktop)",
    "2. Tap + → Import from subscription URL",
    "3. Paste the link above",
    "4. Choose a server and connect",
    "",
    p.supportUsername ? `Support: https://t.me/${p.supportUsername.replace(/^@/, "")}` : "",
  ].join("\n");

  await sendMail({
    to: p.to,
    subject: "Your Korvex VPN subscription",
    html,
    text,
  });
}
