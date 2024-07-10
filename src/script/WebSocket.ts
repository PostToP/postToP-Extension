export function forwardToWebsocket(message: object) {
  chrome.runtime.sendMessage({
    type: "MUSIC_STARTED",
    payload: message,
  });
}
