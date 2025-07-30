import { chromeReceiveMessage } from "../../common/Chrome";
import { RequestOperationType } from "../../common/websocket";
import {
  changeWebsocketURL,
  restartWebsocket,
  sendMessageToWebSocket,
  webSocket,
  webSocketURL,
} from "./WebSocket";

chromeReceiveMessage({ type: "ACTION", key: "MusicListened" }, (data) => {
  sendMessageToWebSocket(RequestOperationType.MUSIC_STARTED, data.value);
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

  if (restart) {
    restartWebsocket();
  }
});
