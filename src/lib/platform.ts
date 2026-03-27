type Platform = 'ios' | 'android' | 'desktop' | 'tv';

export function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'desktop';

  const ua = navigator.userAgent;

  if (/TV|SmartTV|SMART-TV|HbbTV/i.test(ua)) return 'tv';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';

  return 'desktop';
}

export function isInTelegram(): boolean {
  if (typeof window === 'undefined') return false;

  const tg = (window as unknown as Record<string, unknown>).Telegram as
    | { WebApp?: { initData?: string } }
    | undefined;

  return typeof tg?.WebApp?.initData === 'string' && tg.WebApp.initData.length > 0;
}
