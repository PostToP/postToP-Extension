import { WSMessageType } from "../../common/interface";
import {
  changeWebsocketURL,
  sendMessageToWebSocket,
  webSocket,
  webSocketToken,
  webSocketURL,
} from "./WebSocket";

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === WSMessageType.MUSIC_LISTENED)
    sendMessageToWebSocket(WSMessageType.MUSIC_LISTENED, message.payload);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message === "websocketStatus")
    sendResponse({ data: webSocket?.readyState });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== "local") return;
  if (changes["settings"].newValue["webSocketURL"] !== webSocketURL)
    changeWebsocketURL(changes["settings"].newValue["webSocketURL"]);
  if (changes["settings"].newValue["token"] !== webSocketToken)
    changeWebsocketURL(changes["settings"].newValue["token"]);
});
