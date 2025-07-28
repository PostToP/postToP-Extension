import { changeWebsocketURL, restartWebsocket } from "./WebSocket";

chrome.storage.local.get(["settings"], function (result) {
  changeWebsocketURL(result.settings.webSocketURL);
  restartWebsocket();
});
