"use client";

import MainLayout from "@/components/main_layout";
import { useAuth } from "@/contexts/authContext";
import { useController } from "@/contexts/controllerContext";
import useLoading from "@/hooks/useLoading";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

function InnerComponent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const router = useRouter();
  const { setAlert } = useController();
  const { user, loadingAuth } = useAuth();

  useEffect(() => {
    if (!code) return;

    if (code === "200") {
      setAlert({
        text: "به SpotSeller خوش آمدید",
      });

      router.replace("/dashboard");
    } else if (code === "201") {
      setAlert({
        text: "اکانت شما با موفقیت ساخته شد",
      });

      router.replace("/dashboard");
    }
  }, [code, setAlert, router]);

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
