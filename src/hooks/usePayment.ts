// usePayment Hook
import { useEffect, useState } from "react";
import { useSocketRequest } from "./useSocketRequest";
import { useController } from "@/contexts/controllerContext";

type PaymentData = {
  id: string;
  amount: number;
  status: string;
  [key: string]: any;
};

type PaymentLinkResponse = {
  success: boolean;
  url?: string;
  authority?: string;
  message?: string;
};

type PaymentResponse = {
  success: boolean;
  data?: PaymentData;
  message?: string;
};

export default function usePayment(
  paymentId: string | null,
  verifyToken: string | null,
  country: string | undefined
) {
  const [loadingRequest, setLoadingRequest] = useState<boolean>(true);
  const [loadingCreatedLink, setLoadingCreatedLink] = useState<boolean>(true);
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [paymentLink, setPaymentLink] = useState<{
    url: string;
    authority: string;
  }>({ url: "", authority: "" });
  const [isError, setIsError] = useState<boolean>(false);
  const [validField, setValidField] = useState(false);

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { setAlert } = useController();

  useEffect(() => {
    if (!country) return;

    if (!paymentId || !verifyToken || country !== "IR") {
      setLoadingRequest(false);
      setIsError(true);
      return;
    }

    setValidField(true);
  }, [paymentId, verifyToken, country]);

  useEffect(() => {
    if (!validField) return;

    setIsError(false);
    sendEvent("getPayment", { paymentId, verify_token: verifyToken });
  }, [validField]);

  useEffect(() => {
    receiverEvent("getPaymentEventReceiver", (data) => {
      setLoadingRequest(false);
      if (!data.success) {
        setIsError(true);
        setAlert({ text: data.message || "", type: "error" });
        return;
      }
      setPayment(data.data || null);
    });
  }, [receiverEvent, setAlert]);

  useEffect(() => {
    console.log(payment);
  }, [payment]);

  useEffect(() => {
    if (loadingRequest || isError) return;
    if (payment == null) return;

    sendEvent("createPaymentLink", { paymentId, verify_token: verifyToken });
  }, [loadingRequest, isError, paymentId, verifyToken, payment]);

  useEffect(() => {
    const handlePaymentLinkResponse = (data: PaymentLinkResponse) => {
      setLoadingCreatedLink(false);
      if (!data.success) {
        setIsError(true);
        setAlert({ text: data.message || "", type: "error" });
        return;
      }

      setPaymentLink({ url: data.url || "", authority: data.authority || "" });
    };

    receiverEvent("createPaymentLinkEventReceiver", handlePaymentLinkResponse);
  }, [receiverEvent, setAlert]);

  return {
    payment,
    loadingRequest,
    loadingCreatedLink,
    paymentLink,
    isError,
  };
}
