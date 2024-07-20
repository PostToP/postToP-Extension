import { Decision, MusicStatus } from "../interface";
import { log } from "./Logging";
import { determineIfSongDOM, determineIfSongYTAPI, pullData } from "./Music";
import { forwardToWebsocket } from "./WebSocket";

let currentlyPlaying = {
  SRCID: "",
  watchID: "",
  trackName: "",
  artistID: "",
  artistName: "",
  cover: "",
  MusicStatus: MusicStatus.PAUSED,
  isMusic: Decision.NO,
};

export async function handleLoadedMetadata(videoElement: HTMLVideoElement) {
  const isSong = await determineIfSongDOM();
  if (isSong === Decision.NO) return;

  log("New possible music detected");
  let data = await pullData();

  currentlyPlaying = {
    SRCID: videoElement.src,
    watchID: data.watchID,
    trackName: data.trackName || "",
    artistName: data.artist || "",
    artistID: "",
    cover: data.cover || "",
    MusicStatus: MusicStatus.PLAYING,
    isMusic: isSong,
  };

  log(
    `---------\nCurrently Playing:${currentlyPlaying.trackName} by ${currentlyPlaying.artistName}\n---------`
  );
}

export async function handleEnded() {
  const localCopy = { ...currentlyPlaying }; //slight chance that the video element changes before the websocket sends the data
  if (localCopy.isMusic === Decision.NO) return;
  if (localCopy.isMusic === Decision.MAYBE) {
    localCopy.isMusic = await determineIfSongYTAPI();
    if (localCopy.isMusic === Decision.NO) return;
  }
  log("Music sent to websocket");
  const { watchID, artistName: artist } = localCopy;
  forwardToWebsocket({ watchID, artist });
}

export function handleResume() {
  log("Resume event detected");
  currentlyPlaying.MusicStatus = MusicStatus.PLAYING;
}

export function handlePause() {
  log("Pause event detected");
  currentlyPlaying.MusicStatus = MusicStatus.PAUSED;
}

export function handleSeek() {
  log("Seek event detected");
}
