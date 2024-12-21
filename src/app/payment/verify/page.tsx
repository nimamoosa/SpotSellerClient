"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useController } from "@/contexts/controllerContext";
import { useSocket } from "@/contexts/socketContext";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function VerifyPayment() {
  const searchParams = useSearchParams();

  const status = searchParams.get("Status");
  const authority = searchParams.get("Authority");
  const paymentId = searchParams.get("paymentId");
  const token = searchParams.get("token");

  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isValidRequest, setIsValidRequest] = useState(false);
  const [license, setLicense] = useState("");
  const [isCopy, setIsCopy] = useState(false);
  const [courseId, setCourseId] = useState("");

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { clientId } = useSocket();
  const { setAlert } = useController();
  const hasSentUpdate = useRef(false);
  const hasSendCreateLicense = useRef(false);

  useEffect(() => {
    if (!status || !authority || !paymentId || !token) {
      setAlert({ text: "Error" });
      return;
    }

    setIsSuccess(true);
  }, [status, authority, paymentId, token]);

  useEffect(() => {
    if (!isSuccess) return;

    setLoading(true);
    sendEvent("verifyPayment", { paymentId, verify_token: token, authority });
  }, [isSuccess, sendEvent, paymentId, token, authority]);

  useEffect(() => {
    receiverEvent("verifyPaymentEventReceiver", (data) => {
      setLoading(false);

      if (!data.success) {
        setIsError(true);
        setAlert({ text: "این درخواست معتبر نیست", type: "error" });
      } else {
        setCourseId(data.courseId);
        setIsValidRequest(true);
      }
    });
  }, [receiverEvent, clientId, setAlert]);

  useEffect(() => {
    if (loading || !token || !paymentId || !status) return;
    if (hasSentUpdate.current) return;

    hasSentUpdate.current = true;

    sendEvent("updatePaymentField", {
      updateField: {
        finish: isError || status === "NOK" ? false : true,
        cancel: isError || status === "NOK" ? true : false,
        in_progress: false,
      },
      paymentId: encodeURIComponent(paymentId),
      verify_token: token,
    });
  }, [loading, hasSentUpdate, token, paymentId, status, isError, sendEvent]);

  useEffect(() => {
    if (loading || !token || !paymentId || !status || isError) return;
    if (!isValidRequest) return;
    if (status === "NOK") return;
    if (!courseId) return;
    if (hasSendCreateLicense.current) return;

    hasSendCreateLicense.current = true;

    sendEvent("createLicenseKey", { courseId, paymentId });
  }, [
    loading,
    token,
    paymentId,
    status,
    isError,
    isValidRequest,
    courseId,
    hasSendCreateLicense,
    sendEvent,
  ]);

  useEffect(() => {
    receiverEvent("createLicenseKeyEvent", (data) => {
      if (!data.success) {
        return setAlert({
          text: "مشکلی در ساخت لایسنس به وجود آمد",
          type: "error",
        });
      }

      setLicense(data.license);
    });
  }, []);

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

  if (!isValidRequest) {
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

  if (isCopy) {
    return (
      <div className="flex items-center justify-center h-full text-2xl">
        <p>لایسنس با موفقیت کپی شد</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-col gap-5 w-full h-full">
      <div>
        <p>پرداخت شما با موفقیت انجام شد ✔️</p>
      </div>
      <div>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(license).then(() => {
              setIsCopy(true);
            });
          }}
        >
          کپی لایسنس
        </Button>
      </div>
    </div>
  );
}
