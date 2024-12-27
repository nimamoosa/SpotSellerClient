"use client";

import { LicenseType } from "@/types/license";
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
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { Events, ReceiverEvents } from "@/enum/event";

interface LicenseContextProps {
  licenses: LicenseType;
  setLicenses: Dispatch<SetStateAction<LicenseType>>;
  loadingLicenses: boolean;
}

const LicenseContext = createContext<LicenseContextProps>({
  licenses: null,
  setLicenses: () => {},
  loadingLicenses: true,
});

export default function LicenseProvider({ children }: { children: ReactNode }) {
  const [licenses, setLicenses] = useState<LicenseType>(null);
  const [loadingLicenses, setLoadingLicenses] = useState(true);

  const { user } = useAuth();
  const { sendEvent, receiverEvent } = useSocketRequest();

  useEffect(() => {
    if (!user) return;

    sendEvent(Events.GET_LICENSE, { userId: user.userId, botId: user.botId });
  }, [user]);

  useEffect(() => {
    receiverEvent(ReceiverEvents.GET_LICENSE, (data) => {
      setLicenses(data.data?.licenses);
      setLoadingLicenses(false);
    });
  }, []);

  return (
    <LicenseContext.Provider value={{ licenses, setLicenses, loadingLicenses }}>
      {children}
    </LicenseContext.Provider>
  );
}

export const useLicense = () => useContext(LicenseContext);
