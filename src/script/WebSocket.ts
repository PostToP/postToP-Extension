import { WSMessageType } from "../common/interface";

export function forwardToWebsocket(message: object) {
  chrome.runtime.sendMessage({
    type: WSMessageType.MUSIC_LISTENED,
    payload: message,
  });
}
