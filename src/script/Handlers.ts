import { Decision, MusicStatus } from "../interface";
import { log } from "./Logging";
import { isSongAvailableOnYTAPI } from "./API";
import { MusicService } from "./service/MusicService";
import { forwardToWebsocket } from "./WebSocket";
import { CurrentlyPlaying } from "../CurrentlyPlaying";

export async function handleLoadedMetadata(
  strategy: typeof MusicService,
  currentlyPlaying: CurrentlyPlaying
) {
  const isSong = await strategy.determineIfSong();
  if (isSong === Decision.NO) return;

  log("New possible music detected");
  let data = await strategy.pullData();
  currentlyPlaying.setValues({
    watchID: data.watchID,
    trackName: data.trackName,
    artistID: data.authorHandle,
    artistName: data.artist,
    cover: data.cover,
    status: MusicStatus.PLAYING,
    length: data.length,
    isMusic: isSong,
  });
  currentlyPlaying.time = strategy.currentTime();
}

export async function handleEnded(currentlyPlaying: CurrentlyPlaying) {
  currentlyPlaying.status = MusicStatus.ENDED;
  const localCopy = { ...currentlyPlaying }; //slight chance that the video element changes before the websocket sends the data
  if (!localCopy.watchID) return;
  if (localCopy.isMusic === Decision.NO) return;
  if (localCopy.isMusic === Decision.MAYBE)
    if (!(await isSongAvailableOnYTAPI())) return;

  log("Music sent to websocket");
  const { watchID, artistID } = localCopy;
  forwardToWebsocket({ watchID, artistID });
}

export async function handleResume(currentlyPlaying: CurrentlyPlaying) {
  log("Resume event detected");
  currentlyPlaying.status = MusicStatus.PLAYING;
  currentlyPlaying.time = MusicService.currentTime();
}

export async function handlePause(currentlyPlaying: CurrentlyPlaying) {
  log("Pause event detected");
  currentlyPlaying.status = MusicStatus.PAUSED;
  currentlyPlaying.time = MusicService.currentTime();
}

export async function handleSeek(currentlyPlaying: CurrentlyPlaying) {
  log("Seek event detected");
  currentlyPlaying.time = MusicService.currentTime();
}
