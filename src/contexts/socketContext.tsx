"use client";

import { io, Socket } from "socket.io-client";
import {
  createContext,
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useLoading from "@/hooks/useLoading";

// Create a single socket instance outside the component
const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  timeout: 86400000,
  forceNew: true,
  path: "/socket-server",
  secure: true,
  withCredentials: true,
  forceBase64: true,
  query: {
    key: process.env.NEXT_PUBLIC_API_KEY,
  },
  auth: {
    email: "nimastrong852@gmail.com",
    password: "3491f6c3-a7c1-4857-851d-3dd949bcfaa8",
  },
});

const id = crypto.randomUUID();

socketInstance.on("connect", () => {
  socketInstance.emit("register", { clientId: id });
});

interface SocketContextProps {
  socket: Socket;
  socketRef: MutableRefObject<Socket>;
  clientId: string;
  isReconnect: boolean;
  setIsReconnect: Dispatch<SetStateAction<boolean>>;
  isDisconnect: boolean;
  setIsDisconnect: Dispatch<SetStateAction<boolean>>;
}

const SocketContext = createContext<SocketContextProps>({
  socket: socketInstance,
  socketRef: { current: socketInstance },
  clientId: "",
  isReconnect: false,
  setIsReconnect: () => {},
  isDisconnect: false,
  setIsDisconnect: () => {},
});

export default function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket>(socketInstance);
  const [clientId, setClientId] = useState(id);
  const [isReconnect, setIsReconnect] = useState(false);
  const [isDisconnect, setIsDisconnect] = useState<boolean>(false);

  const { stopLoading } = useLoading();

  useEffect(() => {
    const socket = socketRef.current;

    socket.on("connect", () => {
      socketInstance.emit("register", { clientId: id });

      setIsReconnect(true);
      setIsDisconnect(false);
    });

    socket.on("disconnect", () => {
      setIsDisconnect(true);
      stopLoading();
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        socketRef,
        clientId,
        isReconnect,
        setIsReconnect,
        isDisconnect,
        setIsDisconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
