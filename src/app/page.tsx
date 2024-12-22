"use client";

import Auth from "@/components/auth";
import CompleteAuth from "@/components/completeAuth";
import GetAuthCode from "@/components/getAuthCode";
import { useAuth } from "@/contexts/authContext";
import { useBot } from "@/contexts/botContext";
import { useController } from "@/contexts/controllerContext";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { randomBytes } from "crypto";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [state, setState] = useState<"auth" | "submit_code" | "complete_auth">(
    "auth"
  );
  const router = useRouter();
  const pathname = usePathname();

  const { sendEvent, receiverEvent } = useSocketRequest();
  const { auth, code, setAlert, name, alert } = useController();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const { setBot } = useBot();
  const { user, setUser } = useAuth();

  const [codeRoute, setCodeRoute] = useState("");
  const [botTrue, setBotTrue] = useState({
    is: false,
    botId: 0,
    token: "",
    spot_player_key: "",
    authorization_key: "",
  });

  useEffect(() => {
    if (!isLoading && user) {
      pathname !== "/payment" &&
        router.push(codeRoute ? `/dashboard?code=${codeRoute}` : "/dashboard");
    }
  }, [user, isLoading]);

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
      router.push(`/dashboard?code=${data.code}`);
      setUser(auth);
      setBot(data.bot);
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
        const setCookie = async () => {
          await fetch("/api/auth", {
            method: "POST",
            body: JSON.stringify({ sessionId: data.auth_data.sessionId }),
          });
        };

        setCookie();
        setUser(data.auth_data);
        stopLoading();
        return;
      }

      setState("complete_auth");
      stopLoading();
    });
  }, []);

  useEffect(() => {
    receiverEvent("createBotEventReceiver", (data) => {
      if (data.success === false) {
        stopLoading();
        setAlert({
          text: data.message,
          type: "error",
        });
        return;
      }

      setBotTrue({
        is: true,
        botId: data.botId,
        token: data.data.token,
        spot_player_key: data.spot_player_key,
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
      token: botTrue.token,
      spot_player_key: botTrue.spot_player_key,
      authorization_key: botTrue.authorization_key,
    });
  }, [botTrue, auth, name]);

  const handleSendCode = () => {
    sendEvent("authentication", { provider: "phone_number", auth_filed: auth });
    startLoading();
  };

  const handleSubmitCode = () => {
    sendEvent("checkCode", { code, auth_filed: auth });
    startLoading();
  };

  const handleCreateBot = (token: string, spot_player_key: string) => {
    startLoading();
    sendEvent("createBot", {
      token,
      name,
      auth_filed: auth,
      spot_player_key,
      setting: {
        status: false,
      },
    });
  };

  return (
    <main className="flex w-full h-full items-center justify-center">
      <div className="w-[35%] h-[90vh] rounded-2xl bg-white">
        <div className="h-[13vh] border-b-2 flex items-center justify-end w-full">
          <img src="/logo.svg" alt="" className="w-[45%] ml-7" />
        </div>

        <div className="h-[75vh] flex items-center justify-center">
          {state === "auth" ? (
            <>
              <Auth onClick={handleSendCode} />
            </>
          ) : state === "submit_code" ? (
            <>
              <GetAuthCode onClick={handleSubmitCode} />
            </>
          ) : (
            <>
              <CompleteAuth onSubmit={handleCreateBot} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
