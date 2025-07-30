import { VideoStatus } from "../common/interface";
import { log } from "./Logging";
import { MusicService } from "./service/MusicService";
import { forwardToWebsocket } from "./WebSocket";
import { CurrentlyPlaying } from "../common/CurrentlyPlaying";

export async function handleLoadedMetadata(
  strategy: typeof MusicService,
  currentlyPlaying: CurrentlyPlaying
) {
  log("New possible music detected");
  let data = await strategy.pullData();
  currentlyPlaying.setValues({
    watchID: data.watchID,
    trackName: data.trackName,
    artistID: data.authorHandle,
    artistName: data.artist,
    cover: data.cover,
    status: VideoStatus.PLAYING,
    length: data.length,
  });
  currentlyPlaying.time = strategy.currentTime();
}

export async function handleEnded(currentlyPlaying: CurrentlyPlaying) {
  currentlyPlaying.status = VideoStatus.ENDED;
  log("Music sent to websocket");
  const { watchID } = currentlyPlaying;
  forwardToWebsocket({ watchID, currentTime: currentlyPlaying.time, status: currentlyPlaying.status });
}

export async function handleResume(currentlyPlaying: CurrentlyPlaying) {
  log("Resume event detected");
  currentlyPlaying.status = VideoStatus.PLAYING;
  currentlyPlaying.time = MusicService.currentTime();
}

export async function handlePause(currentlyPlaying: CurrentlyPlaying) {
  log("Pause event detected");
  currentlyPlaying.status = VideoStatus.PAUSED;
  currentlyPlaying.time = MusicService.currentTime();
}

export async function handleSeek(currentlyPlaying: CurrentlyPlaying) {
  log("Seek event detected");
  currentlyPlaying.time = MusicService.currentTime();
}

export async function handleAbort(currentlyPlaying: CurrentlyPlaying) {
  log("Abort event detected");
  currentlyPlaying.clear();
}
