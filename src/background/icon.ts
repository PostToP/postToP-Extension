import {browser} from "../common/browser";
export function updateIcon(isConnected: boolean) {
  browser.action.setIcon({
    path: isConnected
      ? {
          16: browser.runtime.getURL("icons/icon-connected-16.png"),
          32: browser.runtime.getURL("icons/icon-connected-32.png"),
          48: browser.runtime.getURL("icons/icon-connected-48.png"),
          128: browser.runtime.getURL("icons/icon-connected-128.png"),
        }
      : {
          16: browser.runtime.getURL("icons/icon-disconnected-16.png"),
          32: browser.runtime.getURL("icons/icon-disconnected-32.png"),
          48: browser.runtime.getURL("icons/icon-disconnected-48.png"),
          128: browser.runtime.getURL("icons/icon-disconnected-128.png"),
        },
  });
}
