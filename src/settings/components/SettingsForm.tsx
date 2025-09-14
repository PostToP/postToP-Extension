import {useEffect, useState} from "preact/compat";
import {chromeSendMessage} from "../Chrome";

export function SettingsForm() {
  const [websocketStatus, setWebsocketStatus] = useState(0);
  const [serverAddress, setServerAddress] = useState("localhost:8000");
  const [logLevel, setLogLevel] = useState("Info");
  const [ytEnabled, setYtEnabled] = useState(false);
  const [ytMusicEnabled, setYtMusicEnabled] = useState(false);
  useEffect(() => {
    chromeSendMessage("GET_WEBSOCKET_STATUS").then(response => {
      if (response && response.value !== undefined) {
        setWebsocketStatus(response.value);
      } else {
        console.error("Failed to get websocket status");
      }
    });

    chrome.storage.local.get(["settings"], result => {
      const {logLevel, yt, ytmusic, serverAddress} = result.settings;
      setLogLevel(logLevel ?? "Info");
      setYtEnabled(yt ?? false);
      setYtMusicEnabled(ytmusic ?? false);
      setServerAddress(serverAddress ?? "localhost:8000");
    });
  }, []);

  function handleSave(event: Event) {
    event.preventDefault();
    const settings = {
      logLevel,
      yt: ytEnabled,
      ytmusic: ytMusicEnabled,
      serverAddress: serverAddress,
    };
    chrome.storage.local.set({settings});
  }
  return (
    <form onSubmit={handleSave}>
      <p>
        Server address:{" "}
        <input
          type="text"
          value={serverAddress}
          onChange={e => setServerAddress((e.target as HTMLInputElement).value)}
        />
      </p>
      <p>WS status: {websocketStatus ? "Connected" : "Disconnected"}</p>
      <p>
        Logging Level:
        <select name="log" value={logLevel} onChange={e => setLogLevel((e.target as HTMLSelectElement).value)}>
          <option value="None">None</option>
          <option value="Info">Info</option>
        </select>
      </p>
      <div>
        <p>
          Youtube:{" "}
          <input
            type="checkbox"
            name="yt"
            checked={ytEnabled}
            onChange={e => setYtEnabled((e.target as HTMLInputElement).checked)}
          />
        </p>
        <p>
          Youtube Music:
          <input
            type="checkbox"
            name="ytmusic"
            checked={ytMusicEnabled}
            onChange={e => setYtMusicEnabled((e.target as HTMLInputElement).checked)}
          />
        </p>
      </div>
      <input type="submit" value="Save" />
    </form>
  );
}
