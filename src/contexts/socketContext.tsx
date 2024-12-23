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

// Create a single socket instance outside the component
const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, {
  transports: ["websocket"],
  reconnection: true,
  timeout: 86400000, // Increase to 60 seconds
  reconnectionAttempts: 10,
  forceNew: true,
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
}

const SocketContext = createContext<SocketContextProps>({
  socket: socketInstance,
  socketRef: { current: socketInstance },
  clientId: "",
  isReconnect: false,
  setIsReconnect: () => {},
});

export default function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket>(socketInstance);
  const [clientId, setClientId] = useState(id);
  const [isReconnect, setIsReconnect] = useState(false);

  useEffect(() => {
    const socket = socketRef.current;

    socket.on("connect", () => {
      socketInstance.emit("register", { clientId: id });

      setIsReconnect(true);
    });

    // socket.on("disconnect", () => {
    //   console.log("Disconnected from WebSocket server");
    // });

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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
