import {
  changeWebsocketURL,
  sendMessageToWebSocket,
} from "./background/WebSocket";
import { WSMessageType } from "./interface";
import "./background/PopupEventListener";

let listenOnYt = true;
let listenOnYtMusic = true;

function handleUpdated(tabId: any, changeInfo: any, tabInfo: any) {
  if (changeInfo.status !== "complete") return;
  if (
    (listenOnYtMusic && tabInfo.url.startsWith("https://music.youtube.com/")) ||
    (listenOnYt && tabInfo.url.startsWith("https://www.youtube.com/watch?v="))
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["js/content_script.js"],
    });
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === WSMessageType.MUSIC_LISTENED)
    sendMessageToWebSocket(WSMessageType.MUSIC_LISTENED, message.payload);
});

chrome.storage.local.get(["settings"], function (result) {
  listenOnYt = result.settings.yt;
  listenOnYtMusic = result.settings.ytmusic;
  changeWebsocketURL(result.settings.webSocketURL);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== "local") return;
  listenOnYt = changes["settings"].newValue["yt"];
  listenOnYtMusic = changes["settings"].newValue["ytmusic"];
});

chrome.tabs.onUpdated.addListener(handleUpdated);
