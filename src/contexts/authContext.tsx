"use client";

import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { AuthType } from "@/types/auth";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSocket } from "./socketContext";
import { Events, ReceiverEvents } from "@/enum/event";
import { useController } from "./controllerContext";

interface AuthContextProps {
  user: AuthType | null;
  setUser: Dispatch<SetStateAction<AuthType | null>>;
  loadingAuth: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  loadingAuth: true,
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthType | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const { startLoading, stopLoading } = useLoading();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { clientId, isReconnect, setIsReconnect, socket } = useSocket();
  const { addAlert, removeAlert, alerts } = useController();

  useEffect(() => {
    startLoading();

    addAlert("کمی صبر کنید....", "success", Infinity, true);

    const getSession = async () => {
      const response = await fetch("/api/auth");

      if (response.status !== 200) {
        setLoadingAuth(false);
        return stopLoading();
      }

      const json = await response.json();

      sendEvent(Events.GET_AUTH, { sessionId: json.sessionId.value });
    };

    getSession();
  }, []);

  useEffect(() => {
    receiverEvent(ReceiverEvents.GET_AUTH, (data) => {
      stopLoading();
      setLoadingAuth(false);

      if (data.success == false) {
        setUser(null);
      } else {
        setUser(data.data);
      }
    });
  }, []);

  useEffect(() => {
    if (!loadingAuth) {
      removeAlert(alerts[0].id);
    }
  }, [loadingAuth]);

  useEffect(() => {
    if (!user) return;
    if (!clientId) return;

    sendEvent("registerId", { clientId, botId: user.botId });
    socket.emit("registerBot", { botId: user.botId });
  }, [user, clientId]);

  useEffect(() => {
    if (!isReconnect) return;
    if (!clientId) return;
    if (!user) return;

    sendEvent("registerId", { clientId, botId: user.botId });
    socket.emit("registerBot", { botId: user.botId });

    setIsReconnect(false);
  }, [isReconnect, user, clientId]);

  return (
    <AuthContext.Provider value={{ user, setUser, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
