import { setCurrentlyPlaying } from ".";
import { chromeSendMessage } from "../common/Chrome";
import { settingsForm, updateWebsocketStatus } from "./DOM";
import { wait } from "./util";

document.addEventListener("DOMContentLoaded", updateWebsocketStatus);
settingsForm.addEventListener("change", () => {
  wait(1000).then(updateWebsocketStatus);
});

chromeSendMessage({
  type: "GET",
  key: "currentlyPlaying",
}).then((response) => {
  if (response) {
    setCurrentlyPlaying(response.value);
  }
});