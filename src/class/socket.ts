import { socketOptions, socketURL } from "@/utils/socket-options";
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";

export default class SocketReference {
  private static socket_settings: Partial<ManagerOptions & SocketOptions> =
    socketOptions();

  private static api_url: string = socketURL;

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
}
