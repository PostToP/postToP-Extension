export function getServerAddress(): Promise<string> {
  return new Promise((resolve, _reject) => {
    chrome.storage.local.get(["settings"], result => {
      const serverAddress = result.settings?.serverAddress || "localhost:8000";
      resolve(serverAddress);
    });
  });
}
