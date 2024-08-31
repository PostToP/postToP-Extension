import { setCurrentlyPlaying } from ".";

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

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(
    tabs[0].id as number,
    { type: "getCurrentlyPlaying" },
    function (response) {
      setCurrentlyPlaying(response.data);
    }
  );
});
