"use client";

import { useSocketRequest } from "@/hooks/useSocketRequest";
import { CooperationSalesType } from "@/types/cooperationSaleType";
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

interface CooperationSalesContextProps {
  cooperationSalesClient: CooperationSalesType | null;
  setCooperationSalesClient: Dispatch<
    SetStateAction<CooperationSalesType | null>
  >;
  isLoadingCooperationSalesClient: boolean;
}

const CooperationSalesContext = createContext<CooperationSalesContextProps>({
  cooperationSalesClient: null,
  setCooperationSalesClient: () => {},
  isLoadingCooperationSalesClient: false,
});

export default function CooperationSalesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cooperationSalesClient, setCooperationSalesClient] =
    useState<CooperationSalesType | null>(null);
  const [isLoadingCooperationSalesClient, setLoadingCooperationSalesClient] =
    useState(false);

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    sendEvent("getCooperationClient", {
      userId: user.userId,
      botId: user.botId,
    });
  }, [user]);

  useEffect(() => {
    receiverEvent("getCooperationClientEventReceiver", (data) => {
      if (!data.success) return setLoadingCooperationSalesClient(false);

      setCooperationSalesClient(data.data);

      setLoadingCooperationSalesClient(false);
    });
  }, []);

  return (
    <CooperationSalesContext.Provider
      value={{
        cooperationSalesClient,
        setCooperationSalesClient,
        isLoadingCooperationSalesClient,
      }}
    >
      {children}
    </CooperationSalesContext.Provider>
  );
}

export const useCooperationSales = () => useContext(CooperationSalesContext);
