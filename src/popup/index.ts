import { CurrentlyPlaying } from "../common/CurrentlyPlaying";
import { setCurrentlyPlayingDOM, $id } from "./DOM";
import "./Serialization";
import "./Loader";

$id("yt")?.addEventListener("click", handleYTClick);
function handleYTClick() {
  const set = ($id("yt") as HTMLInputElement).checked;
  chrome.runtime.sendMessage({ type: "yt", set });
}

$id("ytmusic")?.addEventListener("click", handleYTMusicClick);
function handleYTMusicClick() {
  const set = ($id("ytmusic") as HTMLInputElement).checked;
  chrome.runtime.sendMessage({ type: "ytmusic", set });
}

$id("filterButton")?.addEventListener("click", handleFilter);

function handleFilter() {
  let server = ($id("webSocketURL") as HTMLInputElement)!.value;
  server = server.replace("ws://", "http://") + "/filter";
  fetch(server, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      watchID: currentlyPlaying.watchID,
    }),
  });
}

export let currentlyPlaying: CurrentlyPlaying;
export function setCurrentlyPlaying(cp: CurrentlyPlaying) {
  currentlyPlaying = CurrentlyPlaying.copy(cp);
  setCurrentlyPlayingDOM(currentlyPlaying);
}

// script to popup
chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === "updatePopup") {
    setCurrentlyPlaying(request.data);
  }
});
