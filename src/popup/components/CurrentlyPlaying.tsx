import { useEffect, useState } from "preact/hooks";
import { CurrentlyPlaying, VideoStatus } from "../../common/CurrentlyPlaying";
import { chromeReceiveMessage, chromeSendMessage } from "../../common/Chrome";
import { Time } from "./Time";
import { getWebSocketURL } from "../utils";

async function submitReview(watchID: string, isMusic: boolean) {
    const token = await chrome.storage.local.get("authToken");
    let url = await getWebSocketURL();
    url = url.replace("ws://", "http://");
    url += "/review/music";
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token.authToken}`,
        },
        body: JSON.stringify({
            watchID: watchID,
            is_music: isMusic,
        }),
    })
    if (!res.ok) {
        console.error("Failed to submit review:", res.statusText);
        return;
    }
}


function renderStatus(status: number | undefined): string {
    switch (status) {
        case 0:
            return "Playing";
        case 1:
            return "Playing";
        case 2:
            return "Paused";
        case 3:
            return "Ended";
        default:
            return "Unknown";
    }
}

export function CurrentlyPlayingData() {
    const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying | null>(null);

    useEffect(() => {
        const fetchCurrentlyPlaying = async () => {
            try {
                const response = await chromeSendMessage("GET_CURRENTLY_PLAYING");
                if (response && response.value) {
                    setCurrentlyPlaying((prev) => {
                        const newCP = prev ? CurrentlyPlaying.copy(prev) : new CurrentlyPlaying();
                        newCP.setValues(response.value);
                        return newCP;
                    });
                    console.log("Currently playing:", response.value);
                }
            } catch (error) {
                console.error("Error fetching currently playing:", error);
            }
        };
        fetchCurrentlyPlaying();

        chromeReceiveMessage("VIDEO_UPDATE", (request) => {
            console.log("Received VIDEO_UPDATE:", request);
            if (request.value) {
                setCurrentlyPlaying((prev) => {
                    const newCP = prev ? CurrentlyPlaying.copy(prev) : new CurrentlyPlaying();
                    newCP.setValues(request.value);
                    return newCP;
                });
            }
        });
    }, []);
    return <>
        {currentlyPlaying && currentlyPlaying.watchID &&
            <div>
                <p>Currently playing:</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", lineBreak: "anywhere", wordBreak: "break-all", gap: "10px" }}>
                    <img style={{
                        width: "100%", height: "100%", objectFit: "cover"
                    }} src={currentlyPlaying.cover} />
                    <div>
                        <p>
                            Title: {currentlyPlaying.trackName} ({currentlyPlaying.watchID})
                        </p>
                        <p>
                            Artist: {currentlyPlaying.artistName} ({currentlyPlaying.artistID})
                        </p>
                        <p>Status: {renderStatus(currentlyPlaying.status)}</p>
                        <p>
                            <Time seconds={currentlyPlaying.time} frozen={currentlyPlaying.status == VideoStatus.PAUSED} /> / <Time seconds={currentlyPlaying.length} frozen />
                        </p>
                        <p>Is Music: {currentlyPlaying.isMusic?.is_music ? "Yes" : "No"} {currentlyPlaying.isMusic?.reviewed && <>(Reviewed)</>}</p>
                        {!currentlyPlaying.isMusic?.reviewed &&
                            <div class="flex hidden">
                                <button>Yes</button>
                                <button>No</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        }</>
}