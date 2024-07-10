import { MessageType } from "../interface";

export let webSocket: WebSocket | null = null;

export function connect() {
  webSocket = new WebSocket("ws://localhost:8080");

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

function disconnect() {
  if (webSocket == null) return;
  webSocket.close();
}

function heartbeat() {
  const keepAliveIntervalId = setInterval(() => {
    if (webSocket) sendMessageToWebSocket(MessageType.PING);
    else clearInterval(keepAliveIntervalId);
  }, 20 * 1000);
}

export function sendMessageToWebSocket(type: MessageType, payload?: object) {
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
