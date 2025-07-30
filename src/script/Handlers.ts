import { log } from "./Logging";
import { MusicService } from "./service/MusicService";
import { CurrentlyPlaying, VideoStatus } from "../common/CurrentlyPlaying";

export async function handleLoadedMetadata(
  strategy: typeof MusicService,
  currentlyPlaying: CurrentlyPlaying
) {
  log("New possible music detected");
  let data = await strategy.pullData();
  currentlyPlaying.setValues({
    watchID: data.watchID,
    status: VideoStatus.PLAYING,
    currentTime: strategy.currentTime(),
  });
}

export async function handleEnded(currentlyPlaying: CurrentlyPlaying) {
  log("Video ended");
  currentlyPlaying.setValues({
    status: VideoStatus.ENDED,
  });
}

export async function handleResume(currentlyPlaying: CurrentlyPlaying) {
  log("Resume event detected");
  currentlyPlaying.setValues({
    status: VideoStatus.PLAYING,
    currentTime: MusicService.currentTime(),
  });
}

export async function handlePause(currentlyPlaying: CurrentlyPlaying) {
  log("Pause event detected");
  currentlyPlaying.setValues({
    status: VideoStatus.PAUSED,
    currentTime: MusicService.currentTime(),
  });
}

export async function handleSeek(currentlyPlaying: CurrentlyPlaying) {
  log("Seek event detected");
  currentlyPlaying.setValues({
    currentTime: MusicService.currentTime(),
  });
}

export async function handleAbort(currentlyPlaying: CurrentlyPlaying) {
  log("Abort event detected");
  currentlyPlaying.clear();
}
