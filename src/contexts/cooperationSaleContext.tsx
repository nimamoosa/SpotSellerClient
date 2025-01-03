"use client";

import { useSocketRequest } from "@/hooks/useSocketRequest";
import {
  CooperationSales,
  CooperationSalesClientType,
} from "@/types/cooperationSaleType";
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
  cooperationSalesClient: CooperationSalesClientType | null;
  setCooperationSalesClient: Dispatch<
    SetStateAction<CooperationSalesClientType | null>
  >;
  cooperationSales: CooperationSales | null;
  setCooperationSales: Dispatch<SetStateAction<CooperationSales | null>>;
  isLoadingCooperationSalesClient: boolean;
}

const CooperationSalesContext = createContext<CooperationSalesContextProps>({
  cooperationSalesClient: null,
  setCooperationSalesClient: () => {},
  cooperationSales: null,
  setCooperationSales: () => {},
  isLoadingCooperationSalesClient: false,
});

export default function CooperationSalesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cooperationSalesClient, setCooperationSalesClient] =
    useState<CooperationSalesClientType | null>(null);
  const [cooperationSales, setCooperationSales] =
    useState<CooperationSales | null>(null);
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

    sendEvent("getCooperationSales", {
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

    receiverEvent("getCooperationSalesEventReceiver", (data) => {
      if (!data.success) return;

      setCooperationSales(data.data);
    });
  }, []);

  return (
    <CooperationSalesContext.Provider
      value={{
        cooperationSalesClient,
        setCooperationSalesClient,
        cooperationSales,
        setCooperationSales,
        isLoadingCooperationSalesClient,
      }}
    >
      {children}
    </CooperationSalesContext.Provider>
  );
}

export const useCooperationSales = () => useContext(CooperationSalesContext);
