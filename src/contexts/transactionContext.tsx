"use client";

import { TransactionType } from "@/types/visit";
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

interface TransactionContextProps {
  transactions: TransactionType[];
  setTransactions: Dispatch<SetStateAction<TransactionType[]>>;
  isLoadingTransactions: boolean;
}

const TransactionContext = createContext<TransactionContextProps>({
  transactions: [],
  setTransactions: () => {},
  isLoadingTransactions: true,
});

export default function TransactionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [isLoadingTransactions, setIsLoadingTransaction] = useState(true);

  const { user } = useAuth();
  const { sendEvent, receiverEvent } = useSocketRequest();

  useEffect(() => {
    if (!user) return;

    sendEvent("getTransactions", { botId: user.botId });
  }, [user]);

  useEffect(() => {
    receiverEvent("getTransactionsEventReceiver", (data) => {
      if (!data.success) return setIsLoadingTransaction(false);

      console.log(data);

      setTransactions(data.data?.transactions || data.data);
      setIsLoadingTransaction(false);
    });
  }, [receiverEvent]);

  return (
    <TransactionContext.Provider
      value={{ transactions, setTransactions, isLoadingTransactions }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransaction = () => useContext(TransactionContext);
