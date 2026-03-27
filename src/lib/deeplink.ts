import { activationKeySchema } from '@/lib/validation';
import { DEEP_LINK_SCHEME } from '@/lib/constants';

export function buildActivationDeepLink(key: string): string {
  const parsed = activationKeySchema.parse(key);
  return `${DEEP_LINK_SCHEME}activate?key=${encodeURIComponent(parsed)}`;
}

export function attemptDeepLink(deepLink: string, fallbackUrl: string): void {
  if (typeof window === 'undefined') return;

  window.location.href = deepLink;

  const timeout = setTimeout(() => {
    if (!document.hidden) {
      window.location.href = fallbackUrl;
    }
  }, 2000);

  const handleVisibilityChange = () => {
    if (document.hidden) {
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
}

export function buildConnectDeepLink(server: string): string {
  return `${DEEP_LINK_SCHEME}connect?server=${encodeURIComponent(server)}`;
}
