import { CurrentlyPlaying } from "./CurrentlyPlaying";
import "./popup/Serialization";

// Popup to background
document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.sendMessage(
    { message: "websocketStatus" },
    function (response) {
      const contentElement = document.getElementById(
        "websocketStatus"
      ) as HTMLElement;
      contentElement.innerText =
        response.data == 1 ? "Connected" : "Disconnected";
      if (response.data == 1)
        document
          .getElementById("connectedSettingsForm")
          ?.classList.remove("hidden");
      else
        document
          .getElementById("connectedSettingsForm")
          ?.classList.add("hidden");
    }
  );
});

document.getElementById("yt")?.addEventListener("click", handleYTClick);
function handleYTClick() {
  const set = (document.getElementById("yt") as HTMLInputElement).checked;
  chrome.runtime.sendMessage({ type: "yt", set });
}

document
  .getElementById("ytmusic")
  ?.addEventListener("click", handleYTMusicClick);
function handleYTMusicClick() {
  const set = (document.getElementById("ytmusic") as HTMLInputElement).checked;
  chrome.runtime.sendMessage({ type: "ytmusic", set });
}

// Popup to content script
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(
    tabs[0].id as number,
    { type: "getCurrentlyPlaying" },
    function (response) {
      setCurrentlyPlaying(response.data);
    }
  );
});

function secondsToHms(d: number) {
  const hours = Math.floor(d / 3600);
  const minutes = Math.floor((d % 3600) / 60);
  const seconds = Math.floor((d % 3600) % 60);

  const hoursDisplay = hours.toString().padStart(2, "0");
  const minutesDisplay = minutes.toString().padStart(2, "0");
  const secondsDisplay = seconds.toString().padStart(2, "0");

  return `${hoursDisplay}:${minutesDisplay}:${secondsDisplay}`;
}

let jank: NodeJS.Timer;
function setCurrentlyPlaying(asd: CurrentlyPlaying) {
  const currentlyPlaying = CurrentlyPlaying.copy(asd);
  document
    .getElementById("currentlyPlayingImg")!
    .setAttribute("src", currentlyPlaying.cover!);
  document.getElementById("currentlyPlayingTitle")!.innerText =
    currentlyPlaying.trackName!;
  document.getElementById("currentlyPlayingID")!.innerText =
    currentlyPlaying.watchID!;
  document.getElementById("currentlyPlayingArtist")!.innerText =
    currentlyPlaying.artistName!;
  document.getElementById("currentlyPlayingArtistID")!.innerText =
    currentlyPlaying.artistID!;
  document.getElementById("currentlyPlayingStatus")!.innerText =
    currentlyPlaying.status!.toString();
  document.getElementById("currentlyPlayingTime")!.innerText = secondsToHms(
    currentlyPlaying.time
  );

  clearInterval(jank);
  jank = setInterval(() => {
    document.getElementById("currentlyPlayingTime")!.innerText = secondsToHms(
      currentlyPlaying.time
    );
  }, 1000);

  document.getElementById("currentlyPlayingMaxTime")!.innerText = secondsToHms(
    currentlyPlaying.length!
  );
}

const settingsForm = document.getElementById("settingsForm") as HTMLFormElement;
settingsForm.addEventListener("submit", (e) => e.preventDefault());

// script to popup
chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === "updatePopup") {
    setCurrentlyPlaying(request.data);
  }
});
