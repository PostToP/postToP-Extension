export function chromeSendMessage(
  op: ChromeMessage,
  value?: any,
  from?: ChromeMessageFrom
): Promise<IChromeResponse> {
  const message: IChromeMessage = { op, from, value };
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(response as IChromeResponse);
    });
  });
}

export function chromeReceiveMessage(
  op: ChromeMessage,
  callback?: (response: IChromeMessage) => void,
  response?: () => IChromeResponse,
  ignoreFrom?: ChromeMessageFrom
) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (ignoreFrom && request.from === ignoreFrom) return;
    if (request.op !== op) return;
    if (callback) callback(request);
    if (response) sendResponse(response());
  });
}

export interface IChromeMessage<T = any> {
  op: ChromeMessage;
  from?: ChromeMessageFrom
  value?: T;
}

export interface IChromeResponse<T = any> {
  value: T;
}

export type ChromeMessageFrom = "BACKGROUND" | "POPUP" | "CONTENT_SCRIPT";

export type GetChromeMessage = "GET_CURRENTLY_PLAYING" | "GET_WEBSOCKET_STATUS";

export type ActionChromeMessage = "VIDEO_UPDATE";

export type ChromeMessage = GetChromeMessage | ActionChromeMessage;