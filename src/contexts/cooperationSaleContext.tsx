"use client";

import { CooperationSalesType } from "@/types/cooperationSaleType";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

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
