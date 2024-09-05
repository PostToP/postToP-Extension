import "./SingleMount";
import { waitforElement } from "./DOM";
import {
  handleAbort,
  handleEnded,
  handleLoadedMetadata,
  handlePause,
  handleResume,
  handleSeek,
} from "./Handlers";
import { log } from "./Logging";
import YoutubeMusic from "./service/YoutubeMusic";
import Youtube from "./service/Youtube";
import { MusicService } from "./service/MusicService";
import { CurrentlyPlaying } from "../common/CurrentlyPlaying";
import { chromeReceiveMessage, chromeSendMessage } from "../common/Chrome";

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
  videoElement.addEventListener("abort", () => handleAbort(currentlyPlaying));

  log("Succesfully mounted to video player");

  currentlyPlaying.onUpdate((currentlyPlaying) => {
    chromeSendMessage({
      type: "ACTION",
      key: "currentlyPlayingChanged",
      value: currentlyPlaying.safe(),
    });
  });

  chromeReceiveMessage(
    { type: "GET", key: "currentlyPlaying" },
    undefined,
    () => ({ value: currentlyPlaying.safe() })
  );
}

function startMediaTracking() {
  waitforElement("video.video-stream")
    .then((v) => mount(v as HTMLVideoElement))
    .catch((e) => log(e));
}

startMediaTracking();
