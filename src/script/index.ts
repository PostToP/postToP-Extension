import "./SingleMount";
import {CurrentlyPlaying, VideoStatus} from "../common/CurrentlyPlaying";
import {chromeSendMessage} from "./Chrome";
import {waitforElement} from "./DOM";
import {handleAbort, handleEnded, handleLoadedMetadata, handlePause, handleResume, handleSeek} from "./Handlers";
import {log} from "./log";
import type {MusicService} from "./service/MusicService";
import Youtube from "./service/Youtube";
import YoutubeMusic from "./service/YoutubeMusic";

function mount(videoElement: HTMLVideoElement) {
  const {hostname} = document.location;
  let strategy: typeof MusicService;
  if (hostname === "music.youtube.com") strategy = YoutubeMusic;
  else if (hostname === "www.youtube.com") strategy = Youtube;
  else {
    log.warn(`Not a supported website: ${hostname}`);
    return;
  }

  const currentlyPlaying = new CurrentlyPlaying();
  videoElement.addEventListener("play", () => handleResume(currentlyPlaying));
  videoElement.addEventListener("pause", () => handlePause(currentlyPlaying));
  videoElement.addEventListener("seeked", () => handleSeek(currentlyPlaying));

  videoElement.addEventListener("loadedmetadata", () => handleLoadedMetadata(strategy, currentlyPlaying));

  if (videoElement.readyState >= 1) handleLoadedMetadata(strategy, currentlyPlaying);

  videoElement.addEventListener("ended", () => handleEnded(currentlyPlaying));
  videoElement.addEventListener("abort", () => handleAbort(currentlyPlaying));
  videoElement.addEventListener("emptied", () => handleAbort(currentlyPlaying));

  log.info("Succesfully mounted to video player");

  let debounceTimeout: NodeJS.Timeout | null = null;
  currentlyPlaying.onUpdate(currentlyPlaying => {
    if (currentlyPlaying.status === VideoStatus.ENDED) {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      chromeSendMessage("VIDEO_UPDATE", currentlyPlaying.safe());
      return;
    }

    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      chromeSendMessage("VIDEO_UPDATE", currentlyPlaying.safe());
    }, 100);
  });
}

function startMediaTracking() {
  waitforElement("video.video-stream")
    .then(v => mount(v as HTMLVideoElement))
    .catch(e => log.error(`Error mounting to video player`, e));
}

startMediaTracking();
