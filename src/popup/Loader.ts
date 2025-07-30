import { setCurrentlyPlaying } from ".";
import { chromeReceiveMessage, chromeSendMessage } from "../common/Chrome";
import { settingsForm, updateWebsocketStatus } from "./DOM";
import { wait } from "./util";

document.addEventListener("DOMContentLoaded", updateWebsocketStatus);
settingsForm.addEventListener("change", () => {
  wait(1000).then(updateWebsocketStatus);
});

chromeSendMessage("GET_CURRENTLY_PLAYING").then((response) => {
  if (response) {
    setCurrentlyPlaying(response.value);
  }
});

chromeReceiveMessage("VIDEO_UPDATE", (request) => {
  if (request.value) {
    setCurrentlyPlaying(request.value);
  }
});