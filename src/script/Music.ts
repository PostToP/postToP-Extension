import { Decision } from "../interface";
import { log } from "./Logging";

export async function pullData() {
  const watchID = await getWatchID();
  const mediaSession = await getMediaSessionInfo();
  const data = {
    watchID,
    trackName: mediaSession.title,
    artist: mediaSession.artist,
    cover: mediaSession.cover,
  };
  return data;
}

async function getWatchID() {
  const { href } = document.location;
  const watchID =
    href.match(/v=([^&#]{5,})/)?.[1] ??
    document
      .querySelector<HTMLAnchorElement>("a.ytp-title-link.yt-uix-sessionlink")
      ?.href.match(/v=([^&#]{5,})/)?.[1] ??
    "Unknown";
  return watchID;
}

async function getMediaSessionInfo() {
  let title, artist, cover;
  if ("mediaSession" in navigator) {
    title = navigator.mediaSession.metadata?.title || "Unknown";
    artist = navigator.mediaSession.metadata?.artist || "Unknown";
    cover = navigator.mediaSession.metadata?.artwork[0].src || "Unknown";
  } else {
    log("MediaSession API is not supported in this browser.");
  }
  return { title, artist, cover };
}

export async function determineIfSongDOM() {
  const { hostname } = document.location;
  if (hostname === "music.youtube.com") return Decision.YES;

  const videoInfoDOM = document.getElementById("above-the-fold");
  const caruselTitle = videoInfoDOM?.querySelector(
    "yt-formatted-string#title.style-scope.ytd-rich-list-header-renderer"
  )?.innerHTML;
  if (caruselTitle === "Music") return Decision.YES;
  if (caruselTitle === "Shorts remixing this video") return Decision.YES;
  if (caruselTitle === "This will not happen") return Decision.NO;

  return Decision.MAYBE;
}

export async function determineIfSongYTAPI() {
  const { href } = document.location;

  const watchID = href.match(/v=([^&#]{5,})/)?.[1];
  const lemnsolife = await fetch(
    "https://yt.lemnoslife.com/videos?part=music&id=" + watchID
  );
  const json = await lemnsolife.json();
  return json.items[0].music.available ? Decision.YES : Decision.NO;
}
