export function updateIcon(isConnected: boolean) {
  chrome.action.setIcon({
    path: isConnected
      ? {
          16: chrome.runtime.getURL("icons/icon-connected-16.png"),
          48: chrome.runtime.getURL("icons/icon-connected-48.png"),
          128: chrome.runtime.getURL("icons/icon-connected-128.png"),
        }
      : {
          16: chrome.runtime.getURL("icons/icon-disconnected-16.png"),
          48: chrome.runtime.getURL("icons/icon-disconnected-48.png"),
          128: chrome.runtime.getURL("icons/icon-disconnected-128.png"),
        },
  });
}
