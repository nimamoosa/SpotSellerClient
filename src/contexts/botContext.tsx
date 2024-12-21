"use client";

import { useSocketRequest } from "@/hooks/useSocketRequest";
import { BotInfoType, BotType } from "@/types/bot";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./authContext";

interface BotContextProps {
  bot: BotType | null;
  setBot: Dispatch<SetStateAction<BotType | null>>;
  botInfo: BotInfoType | null;
  setBotInfo: Dispatch<SetStateAction<BotInfoType | null>>;
  isLoadingBots: boolean;
}

const BotContext = createContext<BotContextProps>({
  bot: null,
  setBot: () => {},
  botInfo: null,
  setBotInfo: () => {},
  isLoadingBots: true,
});

export default function BotProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bot, setBot] = useState<BotType | null>(null);
  const [isLoadingBots, setIsLoadingBots] = useState(true);
  const [botInfo, setBotInfo] = useState<BotInfoType | null>(null);

  const { sendEvent, receiverEvent } = useSocketRequest();

  const { user } = useAuth();

  useEffect(() => {
    if (user === null) return;

    sendEvent("getBot", { userId: user.userId });

    receiverEvent("getBotEventReceiver", (data) => {
      if (data.success === false) return setIsLoadingBots(false);

      setBot(data.bot);
      setBotInfo(data.bot_info);

      setIsLoadingBots(false);
    });

    receiverEvent("getBotEventReceiverClientSetter", (data) => {
      setBot(data.data);
    });

    receiverEvent("botInfoEventReceiver", (data) => {
      setBotInfo(data.bot_info);
    });
  }, [user]);

  return (
    <BotContext.Provider
      value={{
        bot,
        setBot,
        botInfo,
        setBotInfo,
        isLoadingBots,
      }}
    >
      {children}
    </BotContext.Provider>
  );
}

export const useBot = () => useContext(BotContext);
