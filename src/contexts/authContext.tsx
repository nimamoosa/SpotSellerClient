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
  const { clientId, isReconnect, setIsReconnect } = useSocket();

  useEffect(() => {
    startLoading();

    const getSession = async () => {
      const response = await fetch("/api/auth");

      if (response.status !== 200) return stopLoading();

      const json = await response.json();

      sendEvent("getAuth", { sessionId: json.sessionId.value });
    };

    getSession();
  }, []);

  useEffect(() => {
    receiverEvent("getAuthEventReceiver", (data) => {
      if (data.success == false) {
        setLoadingAuth(false);
        setUser(null);
      } else {
        setLoadingAuth(false);
        setUser(data.data);
      }
    });
  }, [stopLoading]);

  useEffect(() => {
    if (!user) return;
    if (!clientId) return;

    sendEvent("registerId", { clientId, botId: user.botId });
  }, [user, clientId]);

  useEffect(() => {
    if (!isReconnect) return;
    if (!clientId) return;
    if (!user) return;

    sendEvent("registerId", { clientId, botId: user.botId });

    setIsReconnect(false);
  }, [isReconnect, user, clientId]);

  return (
    <AuthContext.Provider value={{ user, setUser, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
