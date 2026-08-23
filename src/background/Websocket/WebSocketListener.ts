import {browser} from "../../common/browser";
import {CurrentlyPlaying, VideoStatus} from "../../common/CurrentlyPlaying";
import {SettingsRepository} from "../../common/repository/SettingsRepository";
import {RequestOperationType} from "../../common/websocket";
import {chromeReceiveMessage, chromeSendMessage} from "../Chrome";
import {
  changeServerAddress,
  currentlyListening,
  onVideoInfo,
  restartWebsocket,
  sendMessageToWebSocket,
  serverAddress,
  webSocket,
} from "./WebSocket";

const tabStates = new Map<number, CurrentlyPlaying>();
let owningTabId: number | undefined;

chromeReceiveMessage("VIDEO_UPDATE", (data, sender) => {
  const tabId = sender.tab?.id;
  if (tabId === undefined) return;

  if (!data.value.watchID) {
    tabStates.delete(tabId);
  } else {
    let state = tabStates.get(tabId);
    if (!state || state.watchID !== data.value.watchID) state = new CurrentlyPlaying();
    state.setValues(data.value);
    tabStates.set(tabId, state);

    if (state.status === VideoStatus.ENDED) {
      sendVideoUpdate(state);
      tabStates.delete(tabId);
      activate(electOwner());
      return;
    }
  }

  const owner = electOwner();
  if (owner !== tabId && owner === owningTabId) return;
  activate(owner);
});

browser.tabs.onRemoved.addListener(tabId => {
  if (!tabStates.delete(tabId)) return;
  if (tabId === owningTabId) activate(electOwner());
});

onVideoInfo(video => {
  for (const state of tabStates.values()) {
    if (state.watchID === video.watchID) state.setValues({isMusic: video.isMusic});
  }
  const owner = electOwner();
  if (owner !== owningTabId) activate(owner);
});

function activate(tabId: number | undefined) {
  owningTabId = tabId;
  const state = tabId === undefined ? undefined : tabStates.get(tabId);

  if (!state) {
    sendMessageToWebSocket(RequestOperationType.VIDEO_UPDATE, {});
    currentlyListening.clear();
  } else {
    if (currentlyListening.watchID !== state.watchID) currentlyListening.clear();
    const time = sendVideoUpdate(state);
    currentlyListening.setValues({
      watchID: state.watchID,
      time: time,
      status: state.status,
    });
  }

  chromeSendMessage("VIDEO_UPDATE", {value: currentlyListening.safe()}).catch(() => {});
}

function sendVideoUpdate(state: CurrentlyPlaying) {
  const time = state.time;
  sendMessageToWebSocket(RequestOperationType.VIDEO_UPDATE, {
    watchID: state.watchID,
    currentTime: time,
    status: state.status,
  });
  return time;
}

function electOwner() {
  let candidate: number | undefined;
  let bestRank = -1;
  let latest = -1;
  for (const [tabId, state] of tabStates) {
    if (!state.watchID || state.status === VideoStatus.ENDED) continue;
    const rank = state.isMusic?.is_music === false ? 0 : 1;
    const updatedAt = state.updatedAt ?? 0;
    if (rank < bestRank) continue;
    if (rank === bestRank && updatedAt <= latest) continue;
    bestRank = rank;
    latest = updatedAt;
    candidate = tabId;
  }
  return candidate;
}

chromeReceiveMessage("GET_WEBSOCKET_STATUS", () => ({
  value: webSocket?.readyState,
}));

chromeReceiveMessage("GET_CURRENTLY_PLAYING", () => ({
  value: currentlyListening.safe(),
}));

chromeReceiveMessage("RESTART_WEBSOCKET", () => {
  restartWebsocket();
});

SettingsRepository.observeSetting("serverAddress").then(value => {
  changeServerAddress(value);
  restartWebsocket();
});
