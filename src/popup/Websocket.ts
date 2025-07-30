import { chromeSendMessage } from "../common/Chrome";

export async function getWebsocketStatus() {
  return chromeSendMessage("GET_WEBSOCKET_STATUS");
}
