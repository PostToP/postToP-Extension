import { ChromeMessage, chromeReceiveMessage } from "../../common/Chrome";
import { RequestOperationType } from "../../common/websocket";
import {
  changeWebsocketURL,
  currentlyListening,
  restartWebsocket,
  sendMessageToWebSocket,
  webSocket,
  webSocketURL,
} from "./WebSocket";

chromeReceiveMessage("VIDEO_UPDATE", (data) => {
  sendMessageToWebSocket(RequestOperationType.MUSIC_STARTED, data.value);
  currentlyListening.setValues({
    watchID: data.value.watchID,
    time: data.value.currentTime,
    status: data.value.status,
  });
});

chromeReceiveMessage(
  "GET_WEBSOCKET_STATUS",
  undefined,
  () => ({
    value: webSocket?.readyState,
  })
);

// script to popup
chromeReceiveMessage(
  "VIDEO_UPDATE",
  (data) => {
    currentlyListening.setValues(data.value);
  }
);

chromeReceiveMessage(
  "GET_CURRENTLY_PLAYING",
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
