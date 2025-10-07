import {useEffect, useState} from "preact/compat";
import {SettingsRepository} from "../../common/repository/SettingsRepository";
import {chromeSendMessage} from "../Chrome";

export function SettingsForm() {
  const [websocketStatus, setWebsocketStatus] = useState(0);
  const [serverAddress, setServerAddress] = useState("");
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

    SettingsRepository.getSettings().then(settings => {
      const {yt, ytmusic, serverAddress} = settings;
      setYtEnabled(yt);
      setYtMusicEnabled(ytmusic);
      setServerAddress(serverAddress);
    });
  }, []);

  function handleSave(event: Event) {
    event.preventDefault();
    const settings = {
      yt: ytEnabled,
      ytmusic: ytMusicEnabled,
      serverAddress: serverAddress,
    };
    SettingsRepository.saveSettings(settings);
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
