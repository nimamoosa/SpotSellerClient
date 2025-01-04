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
import { useSocket } from "@/contexts/socketContext";

export default function MainResponsive({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  const { loadingAuth } = useAuth();
  const pathname = usePathname();
  const { addAlert, removeAlert, alerts } = useController();
  const { socket } = useSocket();

  useEffect(() => {
    const getIP = async () => {
      const fetchResponse = await fetch("/api/ip_info");

      const json = await fetchResponse.json();

      socket.emit("record", { data: JSON.stringify(json.data) });
    };

    getIP();
  }, []);

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
      ) : loadingAuth && !pathname.startsWith("/payment") ? (
        <LoadingPage />
      ) : (
        children
      )}
    </div>
  );
}
