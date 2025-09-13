import { useEffect, useState } from "preact/hooks";
import { CurrentlyPlaying, VideoStatus } from "../../common/CurrentlyPlaying";
import { Time } from "./Time";
import { getServerAddress } from "../utils";
import { chromeReceiveMessage, chromeSendMessage } from "../Chrome";

async function submitReview(watchID: string, isMusic: boolean) {
    const token = await chrome.storage.local.get("authToken");
    const address = await getServerAddress();
    const url = `http://${address}/review/music`;
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
            setCurrentlyPlaying((prev) => {
                const newCP = prev ? CurrentlyPlaying.copy(prev) : new CurrentlyPlaying();
                newCP.setValues(request.value.value);
                return newCP;
            });
        });
    }, []);

    function handleReview(isMusic: boolean) {
        submitReview(currentlyPlaying!.watchID!, isMusic)
            .then(() => {
                setCurrentlyPlaying((prev) => {
                    const newCP = prev ? CurrentlyPlaying.copy(prev) : new CurrentlyPlaying();
                    newCP.setValues({
                        isMusic: {
                            is_music: prev?.isMusic?.is_music,
                            reviewed: true,
                        },
                    });
                    return newCP;
                });
            })
    }

    return <>
        {currentlyPlaying && currentlyPlaying.watchID &&
            <div key={currentlyPlaying}>
                <p>Currently playing:</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", lineBreak: "anywhere", wordBreak: "break-all", gap: "10px" }}>
                    <div style={{
                        aspectRatio: "1/1",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden"
                    }}>
                        <img style={{
                            width: "135%",
                            height: "135%",
                            objectFit: "cover"
                        }} src={currentlyPlaying.cover} />
                    </div>
                    <div>
                        <div>
                            Title: <a href={`https://music.youtube.com/watch?v=${currentlyPlaying.watchID}`} target="_blank">{currentlyPlaying.trackName}</a>
                        </div>
                        <div>
                            Artist:<a href={`https://music.youtube.com/channel/${currentlyPlaying.artistID}`} target="_blank"> {currentlyPlaying.artistName}</a>
                        </div>
                        <div>Status: {renderStatus(currentlyPlaying.status)}</div>
                        <div>
                            <Time seconds={currentlyPlaying.time} frozen={currentlyPlaying.status == VideoStatus.PAUSED} /> / <Time seconds={currentlyPlaying.length} frozen />
                        </div>
                        <div>Is Music: {currentlyPlaying.isMusic?.is_music ? "Yes" : "No"} {currentlyPlaying.isMusic?.reviewed && <>(Reviewed)</>}</div>
                        {!currentlyPlaying.isMusic?.reviewed &&
                            <div>
                                <button onClick={_ => handleReview(true)}>Yes</button>
                                <button onClick={_ => handleReview(false)}>No</button>
                            </div>
                        }
                    </div>
                </div>
            </div >
        }</>
}