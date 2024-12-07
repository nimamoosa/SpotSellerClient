"use client";

import Alert from "@/components/alert";
import MainLayout from "@/components/main_layout";
import { useController } from "@/contexts/controllerContext";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

function InnerComponent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const router = useRouter();
  const { setOpenToast, setToast } = useController();

  useEffect(() => {
    if (!code) return;

    if (code === "200") {
      setToast({
        title: "موفقیت آمیز",
        description: "به SpotSeller خوش آمدید",
      });
      setOpenToast(true);
      router.replace("/dashboard");
    } else if (code === "201") {
      setToast({
        title: "موفقیت آمیز",
        description: "اکانت شما با موفقیت ساخته شد",
      });
      setOpenToast(true);
      router.replace("/dashboard");
    }
  }, [code, setOpenToast, setToast, router]);

  return null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  Alert();

  return (
    <MainLayout>
      <Suspense fallback={<div>در حال بارگذاری...</div>}>
        <InnerComponent />
      </Suspense>
      {children}
    </MainLayout>
  );
}
