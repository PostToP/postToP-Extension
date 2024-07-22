import "./script/SingleMount";
import { waitforElement } from "./script/DOM";
import {
  handleEnded,
  handleLoadedMetadata,
  handlePause,
  handleResume,
  handleSeek,
} from "./script/Handlers";
import { log } from "./script/Logging";
import YoutubeMusic from "./script/service/YoutubeMusic";
import Youtube from "./script/service/Youtube";
import { MusicService } from "./script/service/MusicService";

function mount(videoElement: HTMLVideoElement) {
  const { hostname } = document.location;
  let strategy: typeof MusicService;
  if (hostname === "music.youtube.com") strategy = YoutubeMusic;
  else if (hostname === "www.youtube.com") strategy = Youtube;
  else {
    log("Not a supported website");
    return;
  }
  videoElement.addEventListener("play", handleResume);
  videoElement.addEventListener("pause", handlePause);
  videoElement.addEventListener("seeked", handleSeek);

  videoElement.addEventListener("loadedmetadata", () =>
    handleLoadedMetadata(strategy)
  );
  videoElement.addEventListener("ended", handleEnded);
  log("Succesfully mounted to video player");
}

function startMediaTracking() {
  waitforElement("video.video-stream")
    .then((v) => mount(v as HTMLVideoElement))
    .catch((e) => log(e));
}

startMediaTracking();
