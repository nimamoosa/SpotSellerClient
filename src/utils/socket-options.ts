import { AUTH_SOCKET } from "@/enum/secure";
import { DecJET, EncJET } from "@/funcs/encryptions";
import { randomBytes } from "crypto";
import { ManagerOptions, SocketOptions } from "socket.io-client";

export const socketOptions = (): Partial<ManagerOptions & SocketOptions> => {
  return {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    path: "/socket-server",
    secure: true,
    withCredentials: true,
    forceBase64: true,
    query: {
      key: process.env.NEXT_PUBLIC_API_KEY,
      auth: EncJET(
        JSON.stringify({ e: Buffer.from(randomBytes(20)).toString("base64") }),
        process.env.NEXT_PUBLIC_ENC_SECRET
      ),
    },
    auth: {
      email: DecJET(AUTH_SOCKET.E, process.env.NEXT_PUBLIC_ENC_SECRET).message,
      password: DecJET(AUTH_SOCKET.P, process.env.NEXT_PUBLIC_ENC_SECRET)
        .message,
    },
  };
};

export const socketURL = (() => process.env.NEXT_PUBLIC_API_URL)();
