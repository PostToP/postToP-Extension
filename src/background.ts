import {
  changeWebsocketURL,
  connect,
  sendMessageToWebSocket,
} from "./background/WebSocket";
import { MessageType } from "./interface";
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
      target: { tabId: tabId, allFrames: true },
      files: ["js/content_script.js"],
    });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "MUSIC_STARTED")
    sendMessageToWebSocket(MessageType.MUSIC, message.payload);
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
