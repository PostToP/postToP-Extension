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
import { CurrentlyPlaying } from "./CurrentlyPlaying";

function mount(videoElement: HTMLVideoElement) {
  const { hostname } = document.location;
  let strategy: typeof MusicService;
  if (hostname === "music.youtube.com") strategy = YoutubeMusic;
  else if (hostname === "www.youtube.com") strategy = Youtube;
  else {
    log("Not a supported website");
    return;
  }

  let currentlyPlaying = new CurrentlyPlaying();
  videoElement.addEventListener("play", () => handleResume(currentlyPlaying));
  videoElement.addEventListener("pause", () => handlePause(currentlyPlaying));
  videoElement.addEventListener("seeked", () => handleSeek(currentlyPlaying));

  videoElement.addEventListener("loadedmetadata", () =>
    handleLoadedMetadata(strategy, currentlyPlaying)
  );

  if (videoElement.readyState >= 1)
    handleLoadedMetadata(strategy, currentlyPlaying);

  videoElement.addEventListener("ended", () => handleEnded(currentlyPlaying));

  log("Succesfully mounted to video player");

  currentlyPlaying.onUpdate((currentlyPlaying) => {
    chrome.runtime.sendMessage({ type: "updatePopup", data: currentlyPlaying });
  });

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.type === "getCurrentlyPlaying")
      sendResponse({ data: currentlyPlaying });
  });
}

function startMediaTracking() {
  waitforElement("video.video-stream")
    .then((v) => mount(v as HTMLVideoElement))
    .catch((e) => log(e));
}

startMediaTracking();
