import { changeServerAddress, restartWebsocket } from "./WebSocket";

chrome.storage.local.get(["settings"], function (result) {
  changeServerAddress(result.settings.serverAddress);
  restartWebsocket();
});
