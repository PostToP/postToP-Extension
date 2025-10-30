import {CurrentlyPlaying} from "../../common/CurrentlyPlaying";
import {RequestOperationType, ResponseOperationType, type VideoResponseData} from "../../common/websocket";
import {chromeSendMessage} from "../Chrome";
import {updateIcon} from "../icon";
import {log} from "../log";

export let webSocket: WebSocket | null = null;
export let serverAddress: string = "localhost:8000";
export const currentlyListening = new CurrentlyPlaying();

export function connect() {
  webSocket = new WebSocket(`ws://${serverAddress}`);

  webSocket.onopen = _event => {
    log.info("WebSocket connection established");
    heartbeat();
    updateIcon(true);
  };

  webSocket.onmessage = event => {
    const data = JSON.parse(event.data);
    log.debug(`WebSocket received message`, data);
    handleAuthEvent(data);
    handleMusicQueryResponse(data);
  };

  webSocket.onclose = _event => {
    log.warn("WebSocket connection closed");
    webSocket = null;
    updateIcon(false);
  };
}

async function handleAuthEvent(data: any) {
  if (data.op === ResponseOperationType.DECLARE_INTENT) {
    const token = await chrome.storage.local.get(["authToken"]);
    webSocket?.send(
      JSON.stringify({
        op: RequestOperationType.AUTH,
        d: {
          token: token.authToken || "",
        },
      }),
    );
  }
}

async function handleMusicQueryResponse(data: any) {
  if (data.op !== ResponseOperationType.VIDEO_UPDATE) return;
  const video = data.d.video as VideoResponseData;
  currentlyListening.setValues({
    watchID: video.watchID,
    cover: video.coverImage,
    length: video.duration,
    trackName: video.title,
    artistID: video.artist.handle,
    artistName: video.artist.name,
    isMusic: video.isMusic,
  });
  chromeSendMessage("VIDEO_UPDATE", {
    value: currentlyListening.safe(),
  });
}

function disconnectWebsocket() {
  if (webSocket == null) return;
  webSocket.close();
}

export function changeServerAddress(url: string) {
  serverAddress = url;
}

export function restartWebsocket() {
  disconnectWebsocket();
  connect();
}

function heartbeat() {
  const keepAliveIntervalId = setInterval(() => {
    if (webSocket) sendMessageToWebSocket(RequestOperationType.HEARTBEAT);
    else clearInterval(keepAliveIntervalId);
  }, 20 * 1000);
}

export function sendMessageToWebSocket(type: RequestOperationType, payload?: object) {
  const data = {
    op: type,
    d: payload || {},
  };
  if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
    log.warn("WebSocket not open, cannot send message");
    return;
  }
  webSocket.send(JSON.stringify(data));
}
