import { currentlyPlaying } from ".";
import { CurrentlyPlaying } from "../common/CurrentlyPlaying";
import { secondsToHms } from "./util";
import { getWebsocketStatus } from "./Websocket";

export const $ = (selector: string) => document.querySelector(selector);
export const $$ = (selector: string) => document.querySelectorAll(selector);
export const $id = (selector: string) => document.getElementById(selector);

export const settingsForm = $id("settingsForm") as HTMLFormElement;
export const logLevelElement = $id("log") as HTMLSelectElement;
export const ytCheckboxElement = $id("yt") as HTMLInputElement;
export const ytmusicCheckboxElement = $id("ytmusic") as HTMLInputElement;
export const webSocketURLElement = $id("webSocketURL") as HTMLInputElement;

let currentlyPlayingSecondsInterval: NodeJS.Timeout;
export function setCurrentlyPlayingDOM(cp: CurrentlyPlaying) {
  $id("currentlyPlayingImg")!.setAttribute("src", cp.cover!);
  $id("currentlyPlayingTitle")!.innerText = cp.trackName!;
  $id("currentlyPlayingID")!.innerText = cp.watchID!;
  $id("currentlyPlayingArtist")!.innerText = cp.artistName!;
  $id("currentlyPlayingArtistID")!.innerText = cp.artistID!;
  let statusText = "Unknown";
  if (cp.status === undefined) statusText = "Unknown";
  else if (cp.status === 0) statusText = "Playing";
  else if (cp.status === 1) statusText = "Paused";
  else if (cp.status === 2) statusText = "Ended";
  $id("currentlyPlayingStatus")!.innerText = statusText;
  $id("currentlyPlayingTime")!.innerText = secondsToHms(cp.time || 0);

  clearInterval(currentlyPlayingSecondsInterval);
  currentlyPlayingSecondsInterval = setInterval(() => {
    $id("currentlyPlayingTime")!.innerText = secondsToHms(cp.time || 0);
  }, 1000);

  $id("currentlyPlayingMaxTime")!.innerText = secondsToHms(cp.length!);
}

export async function updateWebsocketStatus() {
  const { value: status } = await getWebsocketStatus();
  const contentElement = document.getElementById(
    "websocketStatus"
  ) as HTMLElement;
  contentElement.innerText = status == 1 ? "Connected" : "Disconnected";
  if (status == 1)
    document
      .getElementById("connectedSettingsForm")
      ?.classList.remove("hidden");
  else
    document.getElementById("connectedSettingsForm")?.classList.add("hidden");
}
