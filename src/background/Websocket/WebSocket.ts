import { chromeSendMessage } from "../../common/Chrome";
import { CurrentlyPlaying } from "../../common/CurrentlyPlaying";
import { RequestOperationType, ResponseOperationType, VideoResponseData } from "../../common/websocket";
import { updateIcon } from "../icon";

export let webSocket: WebSocket | null = null;
export let serverAddress: string = "localhost:8000";
export let currentlyListening = new CurrentlyPlaying();

export function connect() {
  webSocket = new WebSocket(`ws://${serverAddress}`);

  webSocket.onopen = (event) => {
    console.log("websocket open");
    heartbeat();
    updateIcon(true);
  };

  webSocket.onmessage = (event) => {
    console.log(`websocket received message: ${event.data}`);
    const data = JSON.parse(event.data);
    handleAuthEvent(data);
    handleMusicQueryResponse(data);
  };

  webSocket.onclose = (event) => {
    console.log("websocket connection closed");
    webSocket = null;
    updateIcon(false);
  };
}

async function handleAuthEvent(data: any) {
  if (data.op === ResponseOperationType.DECLARE_INTENT) {
    const token = await chrome.storage.local.get(["authToken"]);
    webSocket?.send(JSON.stringify({
      op: RequestOperationType.AUTH,
      d: {
        token: token.authToken || "",
      },
    }));
  }
}

async function handleMusicQueryResponse(data: any) {
  if (data.op !== ResponseOperationType.VIDEO_UPDATE) return;
  let video = data.d.video as VideoResponseData;
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
  }, "BACKGROUND");
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
    console.log("WebSocket not open");
    return;
  }
  webSocket.send(JSON.stringify(data));
}
