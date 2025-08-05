export function getWebSocketURL(): Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["settings"], (result) => {
            const webSocketURL = result.settings?.webSocketURL || "ws://localhost:8000";
            resolve(webSocketURL);
        });
    });
}