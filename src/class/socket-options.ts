import { AUTH_SOCKET } from "@/enum/secure";
import { DecJET, EncJET } from "@/funcs/encryptions";
import { ManagerOptions, SocketOptions as SK_OPTIONS } from "socket.io-client";

export default class SocketOptions {
  private static queries: typeof this.socketOptions.query = {
    auth: EncJET(
      JSON.stringify({
        serverTime: Date.now(),
      }),
      process.env.NEXT_PUBLIC_ENC_SECRET
    ),
  };

  private static socketOptions = ((): Partial<ManagerOptions & SK_OPTIONS> => {
    return {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      path: "/socket-server",
      secure: true,
      withCredentials: true,
      forceBase64: true,
      query: this.queries,
      auth: {
        email: DecJET(AUTH_SOCKET.E, process.env.NEXT_PUBLIC_ENC_SECRET)
          .message,
        password: DecJET(AUTH_SOCKET.P, process.env.NEXT_PUBLIC_ENC_SECRET)
          .message,
      },
    };
  })();

  public static options: Partial<ManagerOptions & SK_OPTIONS> =
    this.socketOptions;

  public static socketURL = (() => process.env.NEXT_PUBLIC_API_URL)();
}
