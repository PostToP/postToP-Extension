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

function mount(videoElement: HTMLVideoElement) {
  videoElement.addEventListener("play", handleResume);
  videoElement.addEventListener("pause", handlePause);
  videoElement.addEventListener("seeked", handleSeek);

  videoElement.addEventListener("loadedmetadata", () =>
    handleLoadedMetadata(videoElement)
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
