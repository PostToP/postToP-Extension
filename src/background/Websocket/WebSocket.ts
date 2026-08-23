import {browser} from "../../common/browser";
import {CurrentlyPlaying} from "../../common/CurrentlyPlaying";
import {rememberInsecure, serverBases} from "../../common/serverUrl";
import {RequestOperationType, ResponseOperationType, type VideoResponseData} from "../../common/websocket";
import {chromeSendMessage} from "../Chrome";
import {updateIcon} from "../icon";
import {log} from "../log";

export let webSocket: WebSocket | null = null;
export let serverAddress: string = "posttopserver.devla.dev";
export const currentlyListening = new CurrentlyPlaying();
let socketAttempt = 0;

export async function connect() {
  if (webSocket) {
    log.warn("WebSocket already connected");
    return;
  }
  const token = await browser.storage.local.get(["authToken"]);
  if (!token.authToken) {
    log.warn("No auth token found, cannot connect to WebSocket");
    return;
  }

  const urls = serverBases(serverAddress, "ws");
  const url = urls[Math.min(socketAttempt, urls.length - 1)];
  webSocket = new WebSocket(url);
  let opened = false;

  webSocket.onopen = _event => {
    opened = true;
    if (url.startsWith("ws://")) rememberInsecure(serverAddress);
    log.info(`WebSocket connection established to ${url}`);
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
    // never opened means the scheme may be wrong; the next reconnect tries the plaintext one
    socketAttempt = opened ? 0 : socketAttempt + 1;
    log.warn("WebSocket connection closed");
    webSocket = null;
    updateIcon(false);
    currentlyListening.clear();
    chromeSendMessage("VIDEO_UPDATE", {
      value: currentlyListening.safe(),
    });
    setTimeout(() => {
      connect();
    }, 1000);
  };
}

async function handleAuthEvent(data: any) {
  if (data.op === ResponseOperationType.DECLARE_INTENT) {
    const token = await browser.storage.local.get(["authToken"]);
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

const videoInfoListeners: ((video: VideoResponseData) => void)[] = [];
export function onVideoInfo(callback: (video: VideoResponseData) => void) {
  videoInfoListeners.push(callback);
}

async function handleMusicQueryResponse(data: any) {
  if (data.op !== ResponseOperationType.VIDEO_UPDATE) return;
  const video = data.d.video as VideoResponseData;
  videoInfoListeners.forEach(cb => {
    cb(video);
  });
  currentlyListening.setValues({
    watchID: video.watchID,
    cover: video.coverImage,
    length: video.duration,
    trackName: video.title,
    artistID: video.artist.handle,
    artistName: video.artist.name,
    isMusic: video.isMusic,
    NER: video.NER,
    genres: video.genres,
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
  socketAttempt = 0;
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
