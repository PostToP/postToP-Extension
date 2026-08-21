import {browser} from "../common/browser";
import {SettingsRepository} from "../common/repository/SettingsRepository";
import {chromeReceiveMessage} from "./Chrome";
import "./Websocket/WebSocketListener";

let listenOnYt = true;
let listenOnYtMusic = true;

function injectScript(tabId: number) {
  browser.scripting.executeScript({
    target: {tabId: tabId},
    files: ["js/content_script.js"],
  });
}

function isTargetUrl(url: string): boolean {
  return (
    (listenOnYt && url.startsWith("https://www.youtube.com/watch?v=")) ||
    (listenOnYtMusic && url.startsWith("https://music.youtube.com/")) ||
    url.startsWith("http://localhost:3000/") ||
    url.startsWith("https://posttop.devla.dev/")
  );
}

function handleUpdated(tabId: number, changeInfo: chrome.tabs.OnUpdatedInfo, tabInfo: chrome.tabs.Tab) {
  if (changeInfo.status === "complete" && tabInfo.url && isTargetUrl(tabInfo.url)) {
    injectScript(tabId);
  }
}

async function injectIntoExistingTabs() {
  const tabs = await browser.tabs.query({});
  for (const tab of tabs) {
    if (tab.id !== undefined && tab.url && isTargetUrl(tab.url)) injectScript(tab.id);
  }
}

injectIntoExistingTabs();

SettingsRepository.observeSetting("yt").then(value => {
  listenOnYt = value;
});

SettingsRepository.observeSetting("ytmusic").then(value => {
  listenOnYtMusic = value;
});

browser.tabs.onUpdated.addListener(handleUpdated);

chromeReceiveMessage("LOG", req => {
  const {from, value} = req;
  const {level, message, data, timestamp} = value;
  const formatedMessage = `[${from}] ${new Date(timestamp).toISOString()} - ${message}`;

  switch (level) {
    case "debug":
      console.debug(formatedMessage, data ?? "");
      break;
    case "info":
      console.info(formatedMessage, data ?? "");
      break;
    case "warn":
      console.warn(formatedMessage, data ?? "");
      break;
    case "error":
      console.error(formatedMessage, data ?? "");
      break;
    default:
      console.log(formatedMessage, data ?? "");
  }

  return {value: "ok"};
});
