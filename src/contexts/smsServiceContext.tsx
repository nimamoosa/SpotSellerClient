"use client";

import { useSocketRequest } from "@/hooks/useSocketRequest";
import { SmsServiceType } from "@/types/sms_service";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./authContext";

interface SmsServiceContextProps {
  smsService: SmsServiceType | null;
  setSmsService: Dispatch<SetStateAction<SmsServiceType | null>>;
}

const SmsServiceContext = createContext<SmsServiceContextProps>({
  smsService: null,
  setSmsService: () => {},
});

export default function SmsServiceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [smsService, setSmsService] = useState<SmsServiceType | null>(null);

  const { user } = useAuth();

  const { sendEvent, receiverEvent } = useSocketRequest();

  useEffect(() => {
    if (!user) return;

    sendEvent("getSmsService", { botId: user.botId });
  }, [user]);

  useEffect(() => {
    receiverEvent("getSmsServiceEventReceiver", (data) => {
      if (data.success && data.data) {
        setSmsService(data.data);
      }
    });
  }, []);

  return (
    <SmsServiceContext.Provider value={{ smsService, setSmsService }}>
      {children}
    </SmsServiceContext.Provider>
  );
}

export const useSmsService = () => useContext(SmsServiceContext);
