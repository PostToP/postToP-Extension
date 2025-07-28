import {
  logLevelElement,
  settingsForm,
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
  };
  chrome.storage.local.set({ settings });
}

function handleLoad() {
  chrome.storage.local.get(["settings"], function (result) {
    let { logLevel, yt, ytmusic, webSocketURL } = result.settings;
    logLevelElement.value = logLevel ?? "Info";
    ytCheckboxElement.checked = yt ?? false;
    ytmusicCheckboxElement.checked = ytmusic ?? false;
    webSocketURLElement.value = webSocketURL ?? "ws://localhost:8000";
  });
}

document.addEventListener("DOMContentLoaded", handleLoad);
settingsForm.addEventListener("submit", (e) => e.preventDefault());
settingsForm.addEventListener("change", handleSave);
