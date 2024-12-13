"use client";

import { Spinner } from "@/components/ui/spinner";
import { useController } from "@/contexts/controllerContext";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPayment() {
  const searchParams = useSearchParams();

  const status = searchParams.get("Status");
  const authority = searchParams.get("Authority");
  const paymentId = searchParams.get("paymentId");
  const token = searchParams.get("token");

  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isValidRequest, setIsValidRequest] = useState(false);

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { setAlert } = useController();

  useEffect(() => {
    if (!status || !authority || !paymentId || !token) return;

    setIsSuccess(true);
  }, [status, authority, paymentId, token]);

  useEffect(() => {
    if (isSuccess) return;

    sendEvent("verifyPayment", { paymentId, verify_token: token, authority });
  }, [isSuccess]);

  useEffect(() => {
    receiverEvent("verifyPaymentEventReceiver", (data) => {
      setLoading(false);

      if (!data.success) {
        setIsError(true);
        setAlert({ text: "این درخواست معتبر نیست", type: "error" });
        return;
      }

      setIsValidRequest(true);
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!token) return;
    if (!token) return;

    sendEvent("updatePaymentField", {
      updateField: {
        finish: true,
        cancel: isError || status === "NOK",
        in_progress: false,
      },
      paymentId,
      verify_token: token,
    });
  }, [isValidRequest, status, isError, paymentId, token]);

  //   useEffect(() => {
  //     if (loading) return;

  //     sendEvent("createWoocommerce", {
  //       status: isError ? "cancel" : '',
  //     });
  //   }, [loading, isValidRequest, isError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner>درحال چک کردن درخواست.....</Spinner>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>درخواست معتبر نیست</p>
      </div>
    );
  }

  if (isValidRequest) {
    return (
      <div className="flex items-center justify-center h-full text-2xl font-semibold">
        <p>درحال چک کردن درخواست.....</p>
      </div>
    );
  }

  if (status === "NOK") {
    return (
      <div className="flex items-center justify-center h-full text-2xl font-semibold">
        <p>درخواست شما لغو شد</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <p>{status}</p>
      </div>
    </div>
  );
}
