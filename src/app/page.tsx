"use client";

import Alert from "@/components/alert";
import Auth from "@/components/auth";
import CompleteAuth from "@/components/completeAuth";
import GetAuthCode from "@/components/getAuthCode";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";
import { useBot } from "@/contexts/botContext";
import { useController } from "@/contexts/controllerContext";
import { toast as Toast } from "@/hooks/use-toast";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { randomBytes } from "crypto";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [authId, setAuthId] = useState<string>("");
  const [state, setState] = useState<"auth" | "submit_code" | "complete_auth">(
    "auth"
  );
  const router = useRouter();

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { auth, code, setOpenToast, setToast, name } = useController();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const { setBot } = useBot();

  const [codeRoute, setCodeRoute] = useState("");
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.push(codeRoute ? `/dashboard?code=${codeRoute}` : "/dashboard");
    }
  }, [user, isLoading]);

  useEffect(() => {
    const auth_id = localStorage.getItem("authId");
    if (auth_id) {
      setAuthId(auth_id);
    } else {
      setAuthId(randomBytes(20).toString("hex"));
    }
  }, []);

  useEffect(() => {
    receiverEvent("authenticationEvent", (data) => {
      setState("submit_code");

      setOpenToast(true);
      setToast({ description: data.message });
      stopLoading();
      return;
    });

    receiverEvent("loginEventReceiver", (data) => {
      const { auth } = data;

      if (!data.success) {
        setOpenToast(true);
        setToast({
          description: data.message,
        });
        return;
      }

      const setCookie = async () => {
        await fetch("/api/auth", {
          method: "POST",
          body: JSON.stringify({ sessionId: data.auth.sessionId }),
        });
      };

      setCookie();

      setCodeRoute(data.code);
      setUser(auth);
      setBot(data.bot);
      stopLoading();
    });

    receiverEvent("checkCodeEventReceiver", (data) => {
      if (!data.success) {
        setOpenToast(true);
        setToast({
          description: data.message,
        });
        stopLoading();
        return;
      }

      setState("complete_auth");
      stopLoading();
    });
  }, []);

  useEffect(() => {
    receiverEvent("createBotEventReceiver", (data) => {
      const { success } = data;

      if (!success) {
        setOpenToast(true);
        setToast({
          description: data.message,
        });
        stopLoading();
        return;
      }

      sendEvent("login", {
        auth_filed: data.auth_filed,
        name: data.name,
        botId: data.botId,
        site: data.site,
        token: data.data.token,
      });
    });
  }, []);

  Alert();

  const handleSendCode = () => {
    sendEvent("authentication", { provider: "phone_number", auth_filed: auth });
    startLoading();
  };

  const handleSubmitCode = () => {
    sendEvent("checkCode", { code, auth_filed: auth });
    startLoading();
  };

  const handleCreateBot = (
    token: string,
    site: { is_site: boolean; site_link: string }
  ) => {
    startLoading();
    sendEvent("createBot", { token, site, name, auth_filed: auth });
  };

  return (
    <main className="flex w-full">
      <div className="w-[25%] h-full">
        <AnimatePresence mode="wait">
          {state === "auth" ? (
            <motion.div
              initial={{ y: -100, opacity: 0.1 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={{ y: -150, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
              className="w-full h-[100vh]"
              key={"auth"}
            >
              <Auth onClick={handleSendCode} />
            </motion.div>
          ) : state === "submit_code" ? (
            <motion.div
              initial={{ y: 100, opacity: 0.1 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={{ y: 150, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
              className="w-full h-[100vh]"
              key={"submit_code"}
            >
              <GetAuthCode onClick={handleSubmitCode} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 100, opacity: 0.1 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={{ y: 150, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
              className="w-full h-[100vh]"
              key={"complete_auth"}
            >
              <CompleteAuth onSubmit={handleCreateBot} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-[75%]">
        <div className="w-full flex items-center justify-end h-[100vh]">
          <img src="login.png" alt="" className="w-[1200px] h-full" />
        </div>
      </div>
    </main>
  );
}
