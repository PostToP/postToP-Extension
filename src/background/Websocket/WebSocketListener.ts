import { chromeReceiveMessage } from "../../common/Chrome";
import { RequestOperationType } from "../../common/websocket";
import {
  changeWebsocketURL,
  currentlyListening,
  restartWebsocket,
  sendMessageToWebSocket,
  webSocket,
  webSocketURL,
} from "./WebSocket";

chromeReceiveMessage({ type: "ACTION", key: "MusicListened" }, (data) => {
  sendMessageToWebSocket(RequestOperationType.MUSIC_STARTED, data.value);
  currentlyListening.setValues({
    watchID: data.value.watchID,
    currentTime: data.value.currentTime,
    status: data.value.status,
  });
});

chromeReceiveMessage(
  { type: "GET", key: "websocketStatus" },
  undefined,
  () => ({
    value: webSocket?.readyState,
  })
);

// script to popup
chromeReceiveMessage(
  { type: "ACTION", key: "currentlyPlayingChanged" },
  (data) => {
    currentlyListening.setValues(data.value);
  }
);

chromeReceiveMessage(
  { type: "GET", key: "currentlyPlaying" },
  undefined,
  () => ({
    value: currentlyListening.safe(),
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
