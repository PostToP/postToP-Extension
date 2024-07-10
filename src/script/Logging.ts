let currentLogLevel = "Info";
chrome.storage.local.get(["settings"], function (result) {
  currentLogLevel = result.settings.logLevel;
});

export function log(message: string, level = "Info") {
  if (currentLogLevel !== "Info") return;
  console.log(`[${level.toUpperCase()}] - ${message}`);
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== "local") return;
  if (changes["settings"].newValue["logLevel"] !== currentLogLevel)
    currentLogLevel = changes["settings"].newValue["logLevel"];
});
