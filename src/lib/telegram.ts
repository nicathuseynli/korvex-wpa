export function isTelegramWebApp(): boolean {
  if (typeof window === "undefined") return false;

  return (
    typeof window !== "undefined" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (window as any).Telegram?.WebApp !== "undefined"
  );
}

export function getTelegramWebApp() {
  if (!isTelegramWebApp()) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).Telegram.WebApp;
}

export function getTelegramUser() {
  const webApp = getTelegramWebApp();
  if (!webApp?.initDataUnsafe?.user) return null;

  const user = webApp.initDataUnsafe.user;
  return {
    id: String(user.id),
    username: user.username as string | undefined,
    firstName: user.first_name as string,
    lastName: user.last_name as string | undefined,
  };
}

export function telegramReady() {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.ready();
    webApp.expand();
  }
}

export function showMainButton(text: string, onClick: () => void) {
  const webApp = getTelegramWebApp();
  if (!webApp) return;

  webApp.MainButton.setText(text);
  webApp.MainButton.onClick(onClick);
  webApp.MainButton.show();
}

export function hideMainButton() {
  const webApp = getTelegramWebApp();
  if (!webApp) return;

  webApp.MainButton.hide();
}

export function showBackButton(onClick: () => void) {
  const webApp = getTelegramWebApp();
  if (!webApp) return;

  webApp.BackButton.onClick(onClick);
  webApp.BackButton.show();
}

export function hideBackButton() {
  const webApp = getTelegramWebApp();
  if (!webApp) return;

  webApp.BackButton.hide();
}
