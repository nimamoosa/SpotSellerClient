import SocketOptions from "@/class/socket-options";
import {
  io,
  ManagerOptions,
  Socket,
  SocketOptions as SK_OPTIONS,
} from "socket.io-client";

class SocketRequest {
  protected static sendSocketEvent(
    socket: Socket,
    clientId: string | null,
    event: string,
    args: object
  ) {
    if (!socket) return;
    if (!clientId) return;

    return socket.emit(event, { clientId, ...args });
  }

  protected static receiverSocketEvent(
    socket: Socket,
    event: string,
    listener: (...args: any[]) => void
  ) {
    if (!socket) return;

    socket.on(event, listener);

    return () => {
      socket.off(event, listener); // Clean up listener on unmount
    };
  }
}

export default class SocketReference extends SocketRequest {
  private static readonly socket_settings: Partial<
    ManagerOptions & SK_OPTIONS
  > = SocketOptions.options;

  private static readonly api_url: string = SocketOptions.socketURL;

  private static socketID = (() => {
    if (typeof window === "undefined") return null;

    const getClientId = () => {
      const clientId = localStorage.getItem("clientId");
      const expirationTime = localStorage.getItem("clientIdExpiration");

      if (clientId && expirationTime) {
        const currentTime = Date.now();

        if (currentTime < Number(expirationTime)) {
          return clientId;
        }

        localStorage.removeItem("clientId");
        localStorage.removeItem("clientIdExpiration");
      }

      const newClientId = Math.random().toString(36).substring(2, 15);
      const newExpirationTime = Date.now() + 24 * 60 * 60 * 1000;

      localStorage.setItem("clientId", newClientId);
      localStorage.setItem("clientIdExpiration", newExpirationTime.toString());

      return newClientId;
    };

    return getClientId();
  })();

  static socketInstance: Socket = io(this.api_url, this.socket_settings);

  static id: string | null = this.socketID;

  static sendEvent = (event: string, args: object) => {
    return this.sendSocketEvent(this.socketInstance, this.id, event, args);
  };

  static receiverEvent = (
    event: string,
    listener: (...args: any[]) => void
  ) => {
    return this.receiverSocketEvent(this.socketInstance, event, listener);
  };
}
