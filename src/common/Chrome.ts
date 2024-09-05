import { IChromeMessage, IChromeResponse } from "./interface";

export function chromeSendMessage(
  message: IChromeMessage
): Promise<IChromeResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(response as IChromeResponse);
    });
  });
}

export function chromeReceiveMessage(
  message: IChromeMessage,
  callback?: (response: IChromeMessage) => void,
  response?: () => IChromeResponse
) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type !== message.type) return;
    if (request.key !== message.key) return;
    if (callback) callback(request);
    if (response) sendResponse(response());
  });
}
