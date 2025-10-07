import {useEffect, useState} from "preact/compat";
import {CurrentlyPlaying, VideoStatus} from "../../common/CurrentlyPlaying";
import {getServerAddress} from "../../common/utils";
import {chromeReceiveMessage, chromeSendMessage} from "../Chrome";
import {log} from "../log";
import {Time} from "./Time";

async function submitReview(watchID: string, isMusic: boolean) {
  const token = await chrome.storage.local.get("authToken");
  const address = await getServerAddress();
  const url = `http://${address}/review/music`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token.authToken}`,
    },
    body: JSON.stringify({
      watchID: watchID,
      is_music: isMusic,
    }),
  });
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
        if (response?.value) {
          setCurrentlyPlaying(prev => {
            const newCP = prev ? CurrentlyPlaying.copy(prev) : new CurrentlyPlaying();
            newCP.setValues(response.value);
            return newCP;
          });
          log.debug(`Currently playing data fetched`, response.value);
        }
      } catch (error) {
        log.error(`Error fetching currently playing`, error);
      }
    };
    fetchCurrentlyPlaying();

    chromeReceiveMessage("VIDEO_UPDATE", request => {
      log.debug("Received VIDEO_UPDATE", request);
      setCurrentlyPlaying(prev => {
        const newCP = prev ? CurrentlyPlaying.copy(prev) : new CurrentlyPlaying();
        newCP.setValues(request.value.value);
        return newCP;
      });
    });
  }, []);

  function handleReview(isMusic: boolean) {
    submitReview(currentlyPlaying!.watchID!, isMusic).then(() => {
      setCurrentlyPlaying(prev => {
        const newCP = prev ? CurrentlyPlaying.copy(prev) : new CurrentlyPlaying();
        newCP.setValues({
          isMusic: {
            is_music: prev?.isMusic?.is_music,
            reviewed: true,
          },
        });
        return newCP;
      });
    });
  }

  return (
    <>
      {currentlyPlaying?.watchID && (
        <div key={currentlyPlaying}>
          <p>Currently playing:</p>
          <div className="grid grid-cols-[1fr_2fr] break-all gap-2.5">
            <div className="aspect-square flex justify-center items-center overflow-hidden">
              <img className="w-[135%] h-[135%] object-cover" alt="Cover" src={currentlyPlaying.cover} />
            </div>
            <div>
              <div>
                Title:{" "}
                <a
                  href={`https://music.youtube.com/watch?v=${currentlyPlaying.watchID}`}
                  target="_blank"
                  className="hover:underline">
                  {currentlyPlaying.trackName}
                </a>
              </div>
              <div>
                Artist:
                <a
                  href={`https://music.youtube.com/channel/${currentlyPlaying.artistID}`}
                  target="_blank"
                  className="hover:underline">
                  {" "}
                  {currentlyPlaying.artistName}
                </a>
              </div>
              <div>Status: {renderStatus(currentlyPlaying.status)}</div>
              <div>
                <Time seconds={currentlyPlaying.time} frozen={currentlyPlaying.status === VideoStatus.PAUSED} /> /{" "}
                <Time seconds={currentlyPlaying.length} frozen />
              </div>
              <div>
                Is Music: {currentlyPlaying.isMusic?.is_music ? "Yes" : "No"}{" "}
                {currentlyPlaying.isMusic?.reviewed && "(Reviewed)"}
              </div>
              {!currentlyPlaying.isMusic?.reviewed && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={_ => handleReview(true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mr-2">
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={_ => handleReview(false)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
