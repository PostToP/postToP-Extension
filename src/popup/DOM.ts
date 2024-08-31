import { currentlyPlaying } from ".";
import { CurrentlyPlaying } from "../common/CurrentlyPlaying";
import { secondsToHms } from "./util";

export const $ = (selector: string) => document.querySelector(selector);
export const $$ = (selector: string) => document.querySelectorAll(selector);
export const $id = (selector: string) => document.getElementById(selector);

export const settingsForm = $id("settingsForm") as HTMLFormElement;
export const logLevelElement = $id("log") as HTMLSelectElement;
export const ytCheckboxElement = $id("yt") as HTMLInputElement;
export const ytmusicCheckboxElement = $id("ytmusic") as HTMLInputElement;
export const webSocketURLElement = $id("webSocketURL") as HTMLInputElement;
export const tokenElement = $id("token") as HTMLInputElement;


let currentlyPlayingSecondsInterval: NodeJS.Timer;
export function setCurrentlyPlayingDOM(cp: CurrentlyPlaying) {
  $id("currentlyPlayingImg")!.setAttribute("src", cp.cover!);
  $id("currentlyPlayingTitle")!.innerText = cp.trackName!;
  $id("currentlyPlayingID")!.innerText = cp.watchID!;
  $id("currentlyPlayingArtist")!.innerText = cp.artistName!;
  $id("currentlyPlayingArtistID")!.innerText = cp.artistID!;
  $id("currentlyPlayingStatus")!.innerText = cp.status!.toString();
  $id("currentlyPlayingTime")!.innerText = secondsToHms(cp.time);

  clearInterval(currentlyPlayingSecondsInterval);
  currentlyPlayingSecondsInterval = setInterval(() => {
    $id("currentlyPlayingTime")!.innerText = secondsToHms(cp.time);
  }, 1000);

  $id("currentlyPlayingMaxTime")!.innerText = secondsToHms(cp.length!);
}
