// PaymentPage Component
"use client";

import { Spinner } from "@/components/ui/spinner";
import usePayment from "@/hooks/usePayment";
import { ArrowUpRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type IPInfo = {
  country_code?: string;
  ip: string;
};

export default function PaymentPage() {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCancel, setIsCancel] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const paymentId = searchParams.get("paymentId");

  const { isError, loadingRequest, payment, loadingCreatedLink, paymentLink } =
    usePayment(paymentId, token, ipInfo?.country_code);

  useEffect(() => {
    if (!token || !paymentId) return;

    const fetchIPInfo = async () => {
      try {
        const response = await fetch("/api/ip_info");
        const data = await response.json();
        setIpInfo(data.data);
      } catch (error) {
        console.error("Failed to fetch IP info", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIPInfo();
  }, [token, paymentId]);

  if (!token || !paymentId) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>آدرس اشتباه است</p>
      </div>
    );
  }

  if (isCancel)
    return (
      <div className="flex items-center justify-center h-full">
        <p>درخواست با موفقیت لغو شد</p>
      </div>
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner>لطفا کمی صبر کنید....</Spinner>
      </div>
    );
  }

  if (ipInfo?.country_code !== "IR") {
    return (
      <div className="flex items-center justify-center h-full">
        <p>لطفا وی پی ان خود را خاموش کرده و مجدد تلاش کنید</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>مشکلی پیش آمده است</p>
      </div>
    );
  }

  if (loadingRequest) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner>درحال بررسی درخواست.....</Spinner>
      </div>
    );
  }

  if (loadingCreatedLink) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>درحال ساخت لینک پرداخت....</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div>
        <p>لینک پرداخت با موفقیت ساخته شد!</p>
      </div>

      <div className="mt-10 flex items-center justify-center gap-5">
        <div>
          <a
            className="text-blue-800 flex bg-white p-2 rounded-lg"
            href={paymentLink.url}
          >
            <ArrowUpRight /> پرداخت
          </a>
        </div>
      </div>
    </div>
  );
}
