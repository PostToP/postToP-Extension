import { WSMessageType } from "../interface";

export let webSocket: WebSocket | null = null;
export let webSocketURL: string = "ws://localhost:8080";
export let webSocketToken: string = "";
export function connect() {
  webSocket = new WebSocket(webSocketURL + "?token=" + webSocketToken);

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
  disconnectWebsocket();
  webSocketURL = url;
  connect();
}

export function changeToken(newToken: string) {
  disconnectWebsocket();
  webSocketToken = newToken;
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
