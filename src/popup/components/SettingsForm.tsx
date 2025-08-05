import { useEffect, useState } from "preact/hooks";
import { chromeSendMessage } from "../../common/Chrome";

export function SettingsForm() {
    const [websocketStatus, setWebsocketStatus] = useState(0);
    const [webSocketURL, setWebSocketURL] = useState("ws://localhost:8000");
    const [logLevel, setLogLevel] = useState("Info");
    const [ytEnabled, setYtEnabled] = useState(false);
    const [ytMusicEnabled, setYtMusicEnabled] = useState(false);
    useEffect(() => {
        chromeSendMessage("GET_WEBSOCKET_STATUS").then((response) => {
            if (response && response.value !== undefined) {
                setWebsocketStatus(response.value);
            } else {
                console.error("Failed to get websocket status");
            }
        });

        chrome.storage.local.get(["settings"], function (result) {
            let { logLevel, yt, ytmusic, webSocketURL } = result.settings;
            setLogLevel(logLevel ?? "Info");
            setYtEnabled(yt ?? false);
            setYtMusicEnabled(ytmusic ?? false);
            setWebSocketURL(webSocketURL ?? "ws://localhost:8000");
        });
    }, []);

    function handleSave(event: Event) {
        event.preventDefault();
        const settings = {
            logLevel,
            yt: ytEnabled,
            ytmusic: ytMusicEnabled,
            webSocketURL,
        };
        chrome.storage.local.set({ settings });
    }
    return <form onSubmit={handleSave}>
        <p>WS address: <input type="text" value={webSocketURL} /></p>
        <p>WS status: {websocketStatus ? "Connected" : "Disconnected"}</p>
        <p>
            Logging Level:
            <select name="log" value={logLevel}>
                <option value="None">None</option>
                <option value="Info">Info</option>
            </select>
        </p>
        <div>
            <p>Youtube: <input type="checkbox" name="yt" checked={ytEnabled} /></p>
            <p>
                Youtube Music:
                <input type="checkbox" name="ytmusic" checked={ytMusicEnabled} />
            </p>
        </div>
        <input type="submit" value="Save" />
    </form>
}