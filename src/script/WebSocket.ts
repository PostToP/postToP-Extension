import { WSMessageType } from "../interface";

export function forwardToWebsocket(message: object) {
  chrome.runtime.sendMessage({
    type: WSMessageType.MUSIC_LISTENED,
    payload: message,
  });
}
