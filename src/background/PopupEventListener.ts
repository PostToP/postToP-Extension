import { webSocket } from "./WebSocket";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message === "getData")
    sendResponse({ data: webSocket?.readyState });
});
