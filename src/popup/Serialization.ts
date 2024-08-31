const settingsForm = document.getElementById("settingsForm") as HTMLFormElement;
const logLevelElement = document.getElementById("log") as HTMLSelectElement;
const ytCheckboxElement = document.getElementById("yt") as HTMLInputElement;
const ytmusicCheckboxElement = document.getElementById(
  "ytmusic"
) as HTMLInputElement;
const webSocketURLElement = document.getElementById(
  "webSocketURL"
) as HTMLInputElement;
const tokenElement = document.getElementById("token") as HTMLInputElement;

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
    webSocketURLElement.value = webSocketURL ?? "ws://localhost:8080";
    tokenElement.value = token ?? "";
  });
}

document.addEventListener("DOMContentLoaded", handleLoad);
settingsForm.addEventListener("change", handleSave);
