"use client";

import { PaymentClientType } from "@/types/payment";
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

interface PaymentContextProps {
  payment: PaymentClientType;
  setPayment: Dispatch<SetStateAction<PaymentClientType>>;
  isLoadingPayment: boolean;
}

const PaymentContext = createContext<PaymentContextProps>({
  payment: null,
  setPayment: () => {},
  isLoadingPayment: true,
});

export default function PaymentProvider({ children }: { children: ReactNode }) {
  const [payment, setPayment] = useState<PaymentClientType>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);

  const { loadingAuth, user } = useAuth();
  const { sendEvent, receiverEvent } = useSocketRequest();

  useEffect(() => {
    if (loadingAuth) return;
    if (!user) return setIsLoadingPayment(false);

    sendEvent("getClientPayment", { botId: user.botId, userId: user.userId });
  }, [user, loadingAuth]);

  useEffect(() => {
    receiverEvent("getClientPaymentEventReceiver", (data) => {
      setPayment(data.data);
      setIsLoadingPayment(false);
    });
  }, []);

  return (
    <PaymentContext.Provider value={{ payment, setPayment, isLoadingPayment }}>
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => useContext(PaymentContext);
