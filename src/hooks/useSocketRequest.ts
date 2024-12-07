import { useSocket } from "@/contexts/socketContext";
import { useCallback } from "react";

export function useSocketRequest() {
  const { socket, clientId } = useSocket();

  const sendEvent = useCallback(
    (event: string, args: object) => {
      if (!socket) return;

      return socket.emit(event, { clientId, ...args });
    },
    [socket] // Dependency only on socket
  );

  const receiverEvent = useCallback(
    (event: string, listener: (...args: any[]) => void) => {
      if (!socket) return;

      socket.on(event, listener);

      return () => {
        socket.off(event, listener); // Clean up listener on unmount
      };
    },
    [socket]
  );

  return {
    sendEvent,
    receiverEvent,
  };
}
