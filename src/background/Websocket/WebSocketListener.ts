import {SettingsRepository} from "../../common/repository/SettingsRepository";
import {RequestOperationType} from "../../common/websocket";
import {chromeReceiveMessage} from "../Chrome";
import {
  changeServerAddress,
  currentlyListening,
  restartWebsocket,
  sendMessageToWebSocket,
  serverAddress,
  webSocket,
} from "./WebSocket";

chromeReceiveMessage("VIDEO_UPDATE", data => {
  sendMessageToWebSocket(RequestOperationType.VIDEO_UPDATE, data.value);
  if (!data.value.watchID) {
    currentlyListening.clear();
    return;
  }
  currentlyListening.setValues({
    watchID: data.value.watchID,
    time: data.value.currentTime,
    status: data.value.status,
  });
});

chromeReceiveMessage("GET_WEBSOCKET_STATUS", () => ({
  value: webSocket?.readyState,
}));

chromeReceiveMessage("GET_CURRENTLY_PLAYING", () => ({
  value: currentlyListening.safe(),
}));

SettingsRepository.listenToSettingChanges("serverAddress", (newValue, oldValue) => {
  if (newValue !== serverAddress) {
    changeServerAddress(newValue);
    restartWebsocket();
  }
});
