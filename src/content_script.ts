import { Decision } from "./interface";
import { log } from "./script/Logging";
import { forwardToWebsocket } from "./script/WebSocket";
// @ts-ignore
if (!window.__postToPInjected) {
  // @ts-ignore
  window.__postToPInjected = true;
} else {
  throw Error("Already injected");
}
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

async function determineIfSongDOM() {
  const { hostname, href } = document.location;
  if (hostname === "music.youtube.com") return Decision.YES;
  const videoInfoDOM = document.getElementById("above-the-fold");
  const temp = videoInfoDOM?.querySelector(
    "yt-formatted-string#title.style-scope.ytd-rich-list-header-renderer"
  )?.innerHTML;
  if (temp === "Music") return Decision.YES;
  if (temp === "Shorts remixing this video") return Decision.YES;

  return Decision.MAYBE;
}

async function determineIfSongYTAPI() {
  const { hostname, href } = document.location;

  const watchID = href.match(/v=([^&#]{5,})/)?.[1];
  const lemnsolife = await fetch(
    "https://yt.lemnoslife.com/videos?part=music&id=" + watchID
  );
  const json = await lemnsolife.json();
  return json.items[0].music.available ? Decision.YES : Decision.NO;
}

let currentlyPlaying = {
  SRCID: "",
  watchID: "",
  trackName: "",
  artist: "",
  isMusic: Decision.NO,
};

async function handleNewMusic(videoElement: HTMLVideoElement) {
  // if (currentlyPlaying.SRCID === videoElement.src) return;
  // currentlyPlaying.SRCID = videoElement.src;

  const isSong = await determineIfSongDOM();
  //@ts-ignore
  if (isSong === Decision.NO) {
    log("Not a song");
    return;
  }
  log("New music detected");
  let data = pullData();

  log(`---------
  Now playing: ${data.trackName} by ${data.artist}
  watchID: ${data.watchID}
  ---------`);
  currentlyPlaying = {
    SRCID: videoElement.src,
    watchID: data.watchID,
    trackName: data.trackName || "",
    artist: data.artist || "",
    isMusic: isSong,
  };
}

async function handleEnded() {
  if (currentlyPlaying.isMusic === Decision.NO) return;
  if (currentlyPlaying.isMusic === Decision.MAYBE) {
    currentlyPlaying.isMusic = await determineIfSongYTAPI();
    if (currentlyPlaying.isMusic === Decision.NO) return;
  }
  log("music Sent to websocket");
  forwardToWebsocket(currentlyPlaying);
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
  // ensureSingleMounting(videoElement);
  if (!videoElement.paused) handleNewMusic(videoElement);
  videoElement.addEventListener("play", handleResume);
  videoElement.addEventListener("pause", handlePause);
  videoElement.addEventListener("seeked", handleSeek);

  videoElement.addEventListener("loadedmetadata", () =>
    handleNewMusic(videoElement)
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
