import "./Websocket/WebSocketListener";
import "./Websocket/WebSocketSerializer";

let listenOnYt = true;
let listenOnYtMusic = true;

function handleUpdated(tabId: any, changeInfo: any, tabInfo: any) {
  if (changeInfo.status !== "complete") return;
  if (
    (listenOnYtMusic && tabInfo.url.startsWith("https://music.youtube.com/")) ||
    (listenOnYt && tabInfo.url.startsWith("https://www.youtube.com/watch?v="))
  ) {
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      files: ["js/content_script.js"],
    });
  }
}

chrome.storage.local.get(["settings"], result => {
  listenOnYt = result.settings.yt;
  listenOnYtMusic = result.settings.ytmusic;
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== "local") return;
  listenOnYt = changes.settings.newValue.yt;
  listenOnYtMusic = changes.settings.newValue.ytmusic;
});

chrome.tabs.onUpdated.addListener(handleUpdated);
