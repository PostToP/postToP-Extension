import { chromeSendMessage } from "../common/Chrome";

export async function getWebsocketStatus() {
  return chromeSendMessage({ type: "GET", key: "websocketStatus" });
}
