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
document.getElementById("log")?.addEventListener("change", handleLogChange);
function handleLogChange() {
  const logLevel = (document.getElementById("log") as HTMLSelectElement).value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id as number, logLevel);
  });
}

const settingsForm = document.getElementById("settingsForm") as HTMLFormElement;
settingsForm.addEventListener("submit", (e) => e.preventDefault());
