"use client";

import { BotSupportType } from "@/types/botSupport";
import {
  createContext,
  Dispatch,
  SetStateAction,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./authContext";
import { useSocketRequest } from "@/hooks/useSocketRequest";

interface BotSupportContextProps {
  support: BotSupportType | null;
  setSupport: Dispatch<SetStateAction<BotSupportType | null>>;
  isLoadingSupport: boolean;
}

const BotSupportContext = createContext<BotSupportContextProps>({
  support: null,
  setSupport: () => {},
  isLoadingSupport: true,
});

export default function BotSupportProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [support, setSupport] = useState<BotSupportType | null>(null);
  const [isLoadingSupport, setIsLoadingSupport] = useState<boolean>(true);

  const { user } = useAuth();
  const { sendEvent, receiverEvent } = useSocketRequest();

  useEffect(() => {
    if (!user) return;

    sendEvent("getSupport", { botId: user.botId, userId: user.userId });
  }, [user]);

  useEffect(() => {
    receiverEvent("getSupportEventReceiver", (data) => {
      if (!data.success) return setIsLoadingSupport(false);

      setSupport(data.data);
      setIsLoadingSupport(false);
    });
  }, []);

  return (
    <BotSupportContext.Provider
      value={{ support, setSupport, isLoadingSupport }}
    >
      {children}
    </BotSupportContext.Provider>
  );
}

export const useBotSupport = () => useContext(BotSupportContext);
