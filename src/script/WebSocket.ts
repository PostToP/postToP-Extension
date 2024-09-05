import { chromeSendMessage } from "../common/Chrome";

export function forwardToWebsocket(message: object) {
  chromeSendMessage({
    type: "ACTION",
    key: "MusicListened",
    value: message,
  });
}
