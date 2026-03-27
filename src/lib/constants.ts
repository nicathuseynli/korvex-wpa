export const APP_STORE_URL = 'https://apps.apple.com/app/korvex-vpn/id000000000' as const;
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.korvex.vpn' as const;
export const TG_BOT_URL = 'https://t.me/KorvexVPN_Bot' as const;
export const DEEP_LINK_SCHEME = 'korvex://' as const;
export const ACTIVATION_KEY_REGEX = /^[a-f0-9]{32}$/i;

/** Raw value — empty string if not set. Use `requireApiBaseUrl()` in server code. */
export const API_BASE_URL: string = process.env.KORVEX_API_BASE_URL ?? '';

/** Validates that API_BASE_URL is set; throws in production if missing. */
export function requireApiBaseUrl(): string {
  if (!API_BASE_URL && process.env.NODE_ENV !== 'development') {
    throw new Error(
      'KORVEX_API_BASE_URL environment variable is required in production'
    );
  }
  return API_BASE_URL;
}
