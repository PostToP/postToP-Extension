import { ChromeMessage, chromeReceiveMessage } from "../../common/Chrome";
import { RequestOperationType } from "../../common/websocket";
import {
  changeServerAddress,
  currentlyListening,
  restartWebsocket,
  sendMessageToWebSocket,
  webSocket,
  serverAddress,
} from "./WebSocket";

chromeReceiveMessage("VIDEO_UPDATE", (data) => {
  sendMessageToWebSocket(RequestOperationType.VIDEO_UPDATE, data.value);
  currentlyListening.setValues({
    watchID: data.value.watchID,
    time: data.value.currentTime,
    status: data.value.status,
  });
}, undefined, "BACKGROUND");

chromeReceiveMessage(
  "GET_WEBSOCKET_STATUS",
  undefined,
  () => ({
    value: webSocket?.readyState,
  })
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
  if (changes["settings"].newValue["serverAddress"] !== serverAddress) {
    changeServerAddress(changes["settings"].newValue["serverAddress"]);
    restart = true;
  }

  if (restart) {
    restartWebsocket();
  }
});
