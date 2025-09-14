import {type CurrentlyPlaying, VideoStatus} from "../common/CurrentlyPlaying";
import {log} from "./Logging";
import {MusicService} from "./service/MusicService";

export async function handleLoadedMetadata(strategy: typeof MusicService, currentlyPlaying: CurrentlyPlaying) {
  log("New possible music detected");
  const data = await strategy.pullData();
  currentlyPlaying.setValues({
    watchID: data.watchID,
    status: VideoStatus.STARTED,
    time: strategy.currentTime(),
  });
}

export async function handleEnded(currentlyPlaying: CurrentlyPlaying) {
  log("Video ended");
  currentlyPlaying.setValues({
    status: VideoStatus.ENDED,
  });
}

export async function handleResume(currentlyPlaying: CurrentlyPlaying) {
  if (
    currentlyPlaying.status === VideoStatus.STARTED ||
    currentlyPlaying.status === VideoStatus.PLAYING ||
    currentlyPlaying.status === VideoStatus.ENDED
  ) {
    log("Resume event ignored, already playing or ended");
    return;
  }
  log("Resume event detected");
  currentlyPlaying.setValues({
    status: VideoStatus.PLAYING,
    time: MusicService.currentTime(),
  });
}

export async function handlePause(currentlyPlaying: CurrentlyPlaying) {
  log("Pause event detected");
  currentlyPlaying.setValues({
    status: VideoStatus.PAUSED,
    time: MusicService.currentTime(),
  });
}

export async function handleSeek(currentlyPlaying: CurrentlyPlaying) {
  log("Seek event detected");
  currentlyPlaying.setValues({
    time: MusicService.currentTime(),
  });
}

export async function handleAbort(currentlyPlaying: CurrentlyPlaying) {
  log("Abort event detected");
  currentlyPlaying.clear();
}
