import { CurrentlyPlaying } from "../common/CurrentlyPlaying";
import { setCurrentlyPlayingDOM, $id } from "./DOM";
import "./Serialization";
import "./Loader";
import { chromeReceiveMessage } from "../common/Chrome";

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
chromeReceiveMessage(
  { type: "ACTION", key: "currentlyPlayingChanged" },
  (data) => {
    setCurrentlyPlaying(data.value);
  }
);
