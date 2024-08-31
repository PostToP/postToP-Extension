import {
  logLevelElement,
  settingsForm,
  tokenElement,
  webSocketURLElement,
  ytCheckboxElement,
  ytmusicCheckboxElement,
} from "./DOM";

function handleSave() {
  let settings = {
    logLevel: logLevelElement.value,
    yt: ytCheckboxElement.checked,
    ytmusic: ytmusicCheckboxElement.checked,
    webSocketURL: webSocketURLElement.value,
    token: tokenElement.value,
  };
  chrome.storage.local.set({ settings });
}

function handleLoad() {
  chrome.storage.local.get(["settings"], function (result) {
    let { logLevel, yt, ytmusic, webSocketURL, token } = result.settings;
    logLevelElement.value = logLevel ?? "Info";
    ytCheckboxElement.checked = yt ?? false;
    ytmusicCheckboxElement.checked = ytmusic ?? false;
    webSocketURLElement.value = webSocketURL ?? "ws://localhost:8000";
    tokenElement.value = token ?? "";
  });
}

document.addEventListener("DOMContentLoaded", handleLoad);
settingsForm.addEventListener("submit", (e) => e.preventDefault());
settingsForm.addEventListener("change", handleSave);
