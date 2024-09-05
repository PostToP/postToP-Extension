import { chromeReceiveMessage } from "../../common/Chrome";
import { WSMessageType } from "../../common/interface";
import {
  changeWebsocketURL,
  restartWebsocket,
  sendMessageToWebSocket,
  webSocket,
  webSocketToken,
  webSocketURL,
} from "./WebSocket";

chromeReceiveMessage({ type: "ACTION", key: "MusicListened" }, (data) => {
  sendMessageToWebSocket(WSMessageType.MUSIC_LISTENED, data.value);
});

chromeReceiveMessage(
  { type: "GET", key: "websocketStatus" },
  undefined,
  () => ({
    value: webSocket?.readyState,
  })
);

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== "local") return;
  let restart = false;
  if (changes["settings"].newValue["webSocketURL"] !== webSocketURL) {
    changeWebsocketURL(changes["settings"].newValue["webSocketURL"]);
    restart = true;
  }
  if (changes["settings"].newValue["token"] !== webSocketToken) {
    changeWebsocketURL(changes["settings"].newValue["token"]);
    restart = true;
  }
  if (restart) {
    restartWebsocket();
  }
});
