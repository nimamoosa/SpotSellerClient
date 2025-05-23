"use client";

import MainLayout from "@/components/main_layout";
import { useAuth } from "@/contexts/authContext";
import { useController } from "@/contexts/controllerContext";
import useLoading from "@/hooks/useLoading";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

function InnerComponent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const router = useRouter();
  const { addAlert } = useController();
  const { isLoading, stopLoading } = useLoading();
  const { user, loadingAuth } = useAuth();

  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setStatus(code);
  }, [code]);

  useEffect(() => {
    if (!status) return;

    isLoading && stopLoading();

    if (status === "200") {
      addAlert("به SpotSeller خوش آمدید");

      router.replace("/dashboard");
    } else if (status === "201") {
      addAlert("اکانت شما با موفقیت ساخته شد");

      router.replace("/dashboard");
    }
  }, [status]);

  useEffect(() => {
    if (!loadingAuth && !user) router.push("/");
  }, [user, loadingAuth]);

  return null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <Suspense fallback={<div>در حال بارگذاری...</div>}>
        <InnerComponent />
      </Suspense>
      {children}
    </MainLayout>
  );
}
