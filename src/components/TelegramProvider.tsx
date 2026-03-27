"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { isTelegramWebApp, getTelegramWebApp } from "@/lib/telegram";

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  setBackgroundColor: (color: string) => void;
  MainButton: {
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
  };
  initDataUnsafe?: {
    user?: {
      id: number;
      username?: string;
      first_name: string;
      last_name?: string;
    };
  };
}

interface TelegramContextValue {
  isTelegram: boolean;
  webApp: TelegramWebApp | null;
}

const TelegramContext = createContext<TelegramContextValue>({
  isTelegram: false,
  webApp: null,
});

export function useTelegram(): TelegramContextValue {
  return useContext(TelegramContext);
}

export default function TelegramProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isTelegram, setIsTelegram] = useState(false);
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    if (isTelegramWebApp()) {
      const tgWebApp = getTelegramWebApp() as TelegramWebApp | null;
      if (tgWebApp) {
        tgWebApp.ready();
        tgWebApp.expand();
        tgWebApp.setBackgroundColor("#060d0a");
        setWebApp(tgWebApp);
        setIsTelegram(true);
      }
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ isTelegram, webApp }}>
      {children}
    </TelegramContext.Provider>
  );
}
