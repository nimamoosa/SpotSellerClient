"use client";

import { Socket } from "socket.io-client";
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
import { Events, OnMethod } from "@/enum/event";
import SocketReference from "@/class/socket";

const { socketInstance, id } = SocketReference;

socketInstance.on(OnMethod.CONNECT, () => {
  socketInstance.emit(Events.REGISTER, { clientId: id });
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
  const [clientId, setClientId] = useState(id || crypto.randomUUID());
  const [isReconnect, setIsReconnect] = useState(false);
  const [isDisconnect, setIsDisconnect] = useState<boolean>(false);

  const { stopLoading } = useLoading();

  useEffect(() => {
    const socket = socketRef.current;

    socket.on(OnMethod.CONNECT, () => {
      socketInstance.emit(Events.REGISTER, { clientId: id });

      setIsReconnect(true);
      setIsDisconnect(false);
    });

    socket.on(OnMethod.DISCONNECT, () => {
      setIsDisconnect(true);
      stopLoading();
    });

    return () => {
      socket.off(OnMethod.CONNECT);
      socket.off(OnMethod.DISCONNECT);
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
