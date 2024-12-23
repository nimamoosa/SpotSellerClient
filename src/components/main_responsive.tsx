"use client";

import { ReactNode, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Alert from "./alert";
import { useAuth } from "@/contexts/authContext";
import LoadingPage from "./loading_page";
import { usePathname, useRouter } from "next/navigation";
import { useController } from "@/contexts/controllerContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export default function MainResponsive({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  const { loadingAuth } = useAuth();
  const { isDisconnect } = useController();
  const pathname = usePathname();
  const router = useRouter();

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
      {responsive && !pathname.startsWith("/payment") ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-2xl">
            لطفا برای استفاده از spotseller از لپ تاپ یا کامپیوتر وارد شوید
          </p>
        </div>
      ) : isDisconnect ? (
        <>
          <AlertDialog open={isDisconnect}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => router.refresh()}>
                  اتصال
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : loadingAuth && !pathname.startsWith("/payment") ? (
        <LoadingPage />
      ) : (
        children
      )}
    </div>
  );
}
