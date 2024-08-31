import { setCurrentlyPlaying } from ".";
import { settingsForm, updateWebsocketStatus } from "./DOM";
import { wait } from "./util";

document.addEventListener("DOMContentLoaded", updateWebsocketStatus);
settingsForm.addEventListener("change", () => {
  wait(1000).then(updateWebsocketStatus);
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(
    tabs[0].id as number,
    { type: "getCurrentlyPlaying" },
    function (response) {
      setCurrentlyPlaying(response.data);
    }
  );
});
