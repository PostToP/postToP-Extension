import { log } from "./script/Logging";
import { forwardToWebsocket } from "./script/WebSocket";

log("content_script.ts called");

function pullData() {
  let trackName, artist;
  const { href } = document.location;
  const watchID =
    href.match(/v=([^&#]{5,})/)?.[1] ??
    document
      .querySelector<HTMLAnchorElement>("a.ytp-title-link.yt-uix-sessionlink")
      ?.href.match(/v=([^&#]{5,})/)?.[1] ??
    "Unknown";
  if ("mediaSession" in navigator) {
    trackName = navigator.mediaSession.metadata?.title || "Unknown";
    artist = navigator.mediaSession.metadata?.artist || "Unknown";
  } else {
    log("MediaSession API is not supported in this browser.");
  }
  const data = {
    watchID,
    trackName,
    artist,
  };
  return data;
}

function waitforElement(selector: string): Promise<Element> {
  return new Promise((resolve, reject) => {
    let counter = 0;
    const interval = setInterval(() => {
      if (counter > 20) {
        clearInterval(interval);
        reject("Element not found");
      }
      counter++;
      if (document.querySelector(selector)) {
        clearInterval(interval);
        resolve(document.querySelector(selector) as Element);
      }
    }, 200);
  });
}

function determineIfSong() {
  const { hostname } = document.location;
  if (hostname === "music.youtube.com") return true;
}

let lastplayedID: string;
function handleNewMusic(videoElement: HTMLVideoElement) {
  if (lastplayedID === videoElement.src) return;
  lastplayedID = videoElement.src;
  log("New music detected");

  let data = pullData();

  log(`---------
  Now playing: ${data.trackName} by ${data.artist}
  watchID: ${data.watchID}
  ---------`);

  if (data.watchID === "Unknown") return;
  forwardToWebsocket(data);
}

function handleResume() {
  log("Resume event detected");
}

function handlePause() {
  log("Pause event detected");
}

function handleSeek() {
  log("Seek event detected");
}

function ensureSingleMounting(Element: Element) {
  if (Element.getAttribute("fuckChrome") !== null)
    throw Error("Already mounted");
  Element.setAttribute("fuckChrome", "yes");
}

function mount(videoElement: HTMLVideoElement) {
  ensureSingleMounting(videoElement);
  if (!videoElement.paused) handleNewMusic(videoElement);
  videoElement.addEventListener("play", () => handleNewMusic(videoElement));
  videoElement.addEventListener("play", handleResume);
  videoElement.addEventListener("pause", handlePause);
  videoElement.addEventListener("seeked", handleSeek);
  log("Succesfully mounted to video player");
}

function startMediaTracking() {
  waitforElement("video.video-stream")
    .then((v) => mount(v as HTMLVideoElement))
    .catch((e) => log(e));
}

startMediaTracking();
