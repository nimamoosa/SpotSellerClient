import SocketReference from "@/class/socket";

export function useSocketRequest() {
  return {
    sendEvent: SocketReference.sendEvent,
    receiverEvent: SocketReference.receiverEvent,
  };
}
