import { CurrentlyPlaying } from "../../common/CurrentlyPlaying";
import { VideoStatus } from "../../common/interface";
import { RequestOperationType, ResponseOperationType, VideoResponseData } from "../../common/websocket";

export let webSocket: WebSocket | null = null;
export let webSocketURL: string = "ws://localhost:8000";
export let currentlyListening = new CurrentlyPlaying();

export function connect() {
  webSocket = new WebSocket(webSocketURL);

  webSocket.onopen = (event) => {
    console.log("websocket open");
    // heartbeat();
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
  if (data.op !== ResponseOperationType.MUSIC_STARTED) return;
  let video = data.d.video as VideoResponseData;
  currentlyListening.setValues({
    watchID: video.watchID,
    cover: video.coverImage,
    status: VideoStatus.PLAYING,
    length: video.duration,
    trackName: video.title,
    artistID: video.artist.handle,
    artistName: video.artist.name,
  });
}

function disconnectWebsocket() {
  if (webSocket == null) return;
  webSocket.close();
}

export function changeWebsocketURL(url: string) {
  webSocketURL = url;
}

export function restartWebsocket() {
  disconnectWebsocket();
  connect();
}

// function heartbeat() {
//   const keepAliveIntervalId = setInterval(() => {
//     if (webSocket) sendMessageToWebSocket(WSMessageType.PING);
//     else clearInterval(keepAliveIntervalId);
//   }, 20 * 1000);
// }

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
