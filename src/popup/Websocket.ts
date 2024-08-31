export function getWebsocketStatus() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ message: "websocketStatus" }, (response) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(response.data);
    });
  });
}
