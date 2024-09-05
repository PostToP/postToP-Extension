import { changeToken, changeWebsocketURL, restartWebsocket } from "./WebSocket";

chrome.storage.local.get(["settings"], function (result) {
  changeWebsocketURL(result.settings.webSocketURL);
  changeToken(result.settings.token);
  restartWebsocket();
});
