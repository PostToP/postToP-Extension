const settingsForm = document.getElementById("settingsForm") as HTMLFormElement;
const logLevelElement = document.getElementById("log") as HTMLSelectElement;
const ytCheckboxElement = document.getElementById("yt") as HTMLInputElement;
const ytmusicCheckboxElement = document.getElementById(
  "ytmusic"
) as HTMLInputElement;

function handleSave() {
  let settings = {
    logLevel: logLevelElement.value,
    yt: ytCheckboxElement.checked,
    ytmusic: ytmusicCheckboxElement.checked,
  };
  chrome.storage.local.set({ settings });
}

function handleLoad() {
  chrome.storage.local.get(["settings"], function (result) {
    let { logLevel, yt, ytmusic } = result.settings;
    logLevelElement.value = logLevel ?? "Info";
    ytCheckboxElement.checked = yt ?? false;
    ytmusicCheckboxElement.checked = ytmusic ?? false;
  });
}

document.addEventListener("DOMContentLoaded", handleLoad);
settingsForm.addEventListener("change", handleSave);
