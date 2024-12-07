"use client";

import { BotVisitType } from "@/types/visit";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./authContext";
import { useSocketRequest } from "@/hooks/useSocketRequest";

interface BotVisitContextProps {
  botVisits: BotVisitType[];
  setBotVisits: Dispatch<SetStateAction<BotVisitType[]>>;
  isLoadingBotVisits: boolean;
}

const BotVisitContext = createContext<BotVisitContextProps>({
  botVisits: [],
  setBotVisits: () => {},
  isLoadingBotVisits: false,
});

export default function BotVisitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [botVisits, setBotVisits] = useState<BotVisitType[]>([]);

  const [isLoadingBotVisits, setIsLoadingBotVisits] = useState(false);

  const { user } = useAuth();

  const { sendEvent, receiverEvent } = useSocketRequest();

  useEffect(() => {
    if (user === null) return;

    sendEvent("getBotVisit", { botId: user.botId });
  }, [user]);

  useEffect(() => {
    receiverEvent("getBotVisitEventReceiver", (data) => {
      if (!data.success) return setIsLoadingBotVisits(false);
      if (!data?.visit?.users_visit) return setIsLoadingBotVisits(false);

      setBotVisits(data?.visit?.users_visit);
      setIsLoadingBotVisits(false);
    });
  }, []);

  return (
    <BotVisitContext.Provider
      value={{
        botVisits,
        setBotVisits,
        isLoadingBotVisits,
      }}
    >
      {children}
    </BotVisitContext.Provider>
  );
}

export const useBotVisit = () => useContext(BotVisitContext);
