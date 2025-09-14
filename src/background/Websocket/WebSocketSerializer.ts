import {changeServerAddress, restartWebsocket} from "./WebSocket";

chrome.storage.local.get(["settings"], result => {
  changeServerAddress(result.settings.serverAddress);
  restartWebsocket();
});
