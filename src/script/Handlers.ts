import { Decision, MusicStatus } from "../interface";
import { log } from "./Logging";
import { isSongAvailableOnYTAPI } from "./API";
import { MusicService } from "./service/MusicService";
import { forwardToWebsocket } from "./WebSocket";

let currentlyPlaying = {
  watchID: "",
  trackName: "",
  artistID: "",
  artistName: "",
  cover: "",
  MusicStatus: MusicStatus.PAUSED,
  isMusic: Decision.NO,
};

export async function handleLoadedMetadata(strategy: typeof MusicService) {
  const isSong = await strategy.determineIfSong();
  if (isSong === Decision.NO) return;

  log("New possible music detected");
  let data = await strategy.pullData();

  currentlyPlaying = {
    watchID: data.watchID,
    trackName: data.trackName || "",
    artistName: data.artist || "",
    artistID: data.authorHandle || "",
    cover: data.cover || "",
    MusicStatus: MusicStatus.PLAYING,
    isMusic: isSong,
  };

  log(
    `---------\nCurrently Playing:${currentlyPlaying.trackName} by ${currentlyPlaying.artistName}\n---------`
  );
  console.dir(currentlyPlaying);
}

export async function handleEnded() {
  const localCopy = { ...currentlyPlaying }; //slight chance that the video element changes before the websocket sends the data
  if (localCopy.watchID === "Unknown") return;
  if (localCopy.isMusic === Decision.NO) return;
  if (localCopy.isMusic === Decision.MAYBE)
    if (!(await isSongAvailableOnYTAPI())) return;

  log("Music sent to websocket");
  const { watchID, artistID } = localCopy;
  forwardToWebsocket({ watchID, artistID });
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
