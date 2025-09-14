export function getServerAddress(): Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["settings"], (result) => {
            const serverAddress = result.settings?.serverAddress || "localhost:8000";
            resolve(serverAddress);
        });
    });
}