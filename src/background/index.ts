import {SettingsRepository} from "../common/repository/SettingsRepository";
import {chromeReceiveMessage} from "./Chrome";
import "./Websocket/WebSocketListener";
import "./Websocket/WebSocketSerializer";

let listenOnYt = true;
let listenOnYtMusic = true;

function handleUpdated(tabId: any, changeInfo: any, tabInfo: any) {
  if (changeInfo.status !== "complete") return;
  if (
    (listenOnYtMusic && tabInfo.url.startsWith("https://music.youtube.com/")) ||
    (listenOnYt && tabInfo.url.startsWith("https://www.youtube.com/watch?v="))
  ) {
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      files: ["js/content_script.js"],
    });
  }
}

SettingsRepository.getSettings().then(settings => {
  if (settings.yt) listenOnYt = settings.yt;
  if (settings.ytmusic) listenOnYtMusic = settings.ytmusic;
});

SettingsRepository.listenToSettingChanges("yt", (newValue, oldValue) => {
  listenOnYt = newValue;
});

SettingsRepository.listenToSettingChanges("ytmusic", (newValue, oldValue) => {
  listenOnYtMusic = newValue;
});

chrome.tabs.onUpdated.addListener(handleUpdated);

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
