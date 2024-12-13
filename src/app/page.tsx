"use client";

// import Alert from "@/components/alert";
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
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [authId, setAuthId] = useState<string>("");
  const [state, setState] = useState<"auth" | "submit_code" | "complete_auth">(
    "auth"
  );
  const router = useRouter();
  const pathname = usePathname();

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { auth, code, setAlert, name } = useController();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const { setBot } = useBot();
  const { user, setUser } = useAuth();

  const [codeRoute, setCodeRoute] = useState("");
  const [botTrue, setBotTrue] = useState({
    is: false,
    botId: 0,
    token: "",
    spot_player_key: "",
    site: { is_site: false, site_link: "" },
    authorization_key: "",
  });

  useEffect(() => {
    if (!isLoading && user) {
      pathname !== "/payment" &&
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

      setAlert({ text: data.message });
      stopLoading();
      return;
    });

    receiverEvent("loginEventReceiver", (data) => {
      const { auth } = data;

      if (!data.success) {
        setAlert({
          text: data.message,
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
        setAlert({
          text: data.message,
        });
        stopLoading();
        return;
      }

      if (data.is_auth) {
        setUser(data.auth_data);
        stopLoading();
      }

      setState("complete_auth");
      stopLoading();
    });
  }, []);

  useEffect(() => {
    receiverEvent("createBotEventReceiver", (data) => {
      const { success } = data;

      if (!success) {
        setAlert({
          text: data.message,
        });
        stopLoading();
        return;
      }

      console.log(true);

      setBotTrue({
        is: true,
        botId: data.botId,
        token: data.data.token,
        spot_player_key: data.spot_player_key,
        site: data.site,
        authorization_key: data.authorization_key,
      });
    });
  }, []);

  useEffect(() => {
    if (!botTrue.is) return;

    sendEvent("login", {
      auth_filed: auth,
      name,
      botId: botTrue.botId,
      site: botTrue.site,
      token: botTrue.token,
      spot_player_key: botTrue.spot_player_key,
      authorization_key: botTrue.authorization_key,
    });
  }, [botTrue, auth, name]);

  // Alert();

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
    site: { is_site: boolean; site_link: string; authorization_key: string },
    spot_player_key: string
  ) => {
    startLoading();
    sendEvent("createBot", {
      token,
      site,
      name,
      auth_filed: auth,
      spot_player_key,
      authorization_key: site.authorization_key,
    });
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
