import { WSMessageType } from "../../common/interface";

export let webSocket: WebSocket | null = null;
export let webSocketURL: string = "ws://localhost:8000";

export function connect() {
  webSocket = new WebSocket(webSocketURL);

  webSocket.onopen = (event) => {
    console.log("websocket open");
    heartbeat();
  };

  webSocket.onmessage = (event) => {
    console.log(`websocket received message: ${event.data}`);
  };

  webSocket.onclose = (event) => {
    console.log("websocket connection closed");
    webSocket = null;
  };
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

function heartbeat() {
  const keepAliveIntervalId = setInterval(() => {
    if (webSocket) sendMessageToWebSocket(WSMessageType.PING);
    else clearInterval(keepAliveIntervalId);
  }, 20 * 1000);
}

export function sendMessageToWebSocket(type: WSMessageType, payload?: object) {
  const data = {
    type,
    payload,
  };
  if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
    console.log("WebSocket not open");
    return;
  }
  webSocket.send(JSON.stringify(data));
}
