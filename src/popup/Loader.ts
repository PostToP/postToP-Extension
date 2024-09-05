import { setCurrentlyPlaying } from ".";
import { settingsForm, updateWebsocketStatus } from "./DOM";
import { wait } from "./util";

document.addEventListener("DOMContentLoaded", updateWebsocketStatus);
settingsForm.addEventListener("change", () => {
  wait(1000).then(updateWebsocketStatus);
});

chrome.tabs.query({ audible: true }, (tabs) => {
  for (let tab of tabs) {
    try {
      chrome.tabs.sendMessage(
        tab.id as number,
        { type: "GET", key: "currentlyPlaying" },
        function (response) {
          if (!response) return;
          setCurrentlyPlaying(response.value);
        }
      );
    } catch (e) {}
  }
});
