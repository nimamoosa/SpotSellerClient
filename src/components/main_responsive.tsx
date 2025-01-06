"use client";

import { ReactNode, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Alert, AlertButtons } from "./alert";
import { useAuth } from "@/contexts/authContext";
import LoadingPage from "./loading_page";
import { usePathname, useRouter } from "next/navigation";
import InstallButton from "./installButton";

export default function MainResponsive({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  const { loadingAuth } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const responsive = useMediaQuery({ query: "(max-width: 1295px)" });

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-full h-[100vh] max-w-[1600px] ml-auto mr-auto">
      <Alert />
      <AlertButtons />

      {responsive && !pathname.startsWith("/payment") ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-2xl">
            لطفا برای استفاده از spotseller از لپ تاپ یا کامپیوتر وارد شوید
          </p>
        </div>
      ) : loadingAuth && !pathname.startsWith("/payment") ? (
        <LoadingPage />
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
