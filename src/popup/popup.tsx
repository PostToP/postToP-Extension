import {useContext, useState} from "preact/hooks";
import {browser} from "../common/browser";
import {SettingsRepository} from "../common/repository/SettingsRepository";
import {CurrentlyPlayingData} from "./components/CurrentlyPlaying";
import {CurrentlyPlayingContext} from "./context/CurrentlyPlayingContext";

export async function sendIsMusicReview(watchID: string, isMusic: boolean) {
  const {authToken} = await browser.storage.local.get("authToken");
  const address = await SettingsRepository.getSetting("serverAddress");
  const url = `https://${address}/review/music`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${authToken}`,
    },
    body: JSON.stringify({
      watchID: watchID,
      is_music: isMusic,
    }),
  });
  alert("Review submitted. Thank you!");
}

export async function deleteIsMusicReview(watchID: string) {
  const {authToken} = await browser.storage.local.get("authToken");
  const address = await SettingsRepository.getSetting("serverAddress");
  const url = `https://${address}/review/music`;
  fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${authToken}`,
    },
    body: JSON.stringify({
      watchID: watchID,
    }),
  });
  alert("Review deleted.");
}

export default function Popup() {
  const currentlyPlaying = useContext(CurrentlyPlayingContext);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const showPlaying =
    currentlyPlaying !== null &&
    currentlyPlaying !== undefined &&
    (currentlyPlaying.isMusic === undefined || currentlyPlaying.isMusic?.is_music === true);

  const reviewInfo = currentlyPlaying?.isMusic;
  const isReviewed = reviewInfo?.reviewed;
  const isUserSubmission = reviewInfo?.user_submission;
  const statusLabel = (() => {
    if (currentlyPlaying?.status === undefined) return "-";
    const labels = ["started", "playing", "paused", "ended"];
    return labels[currentlyPlaying.status] ?? String(currentlyPlaying.status);
  })();

  const formatSeconds = (value?: number) => {
    if (value === undefined || value === null) return "-";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const formatTimestamp = (value?: number) => {
    if (!value) return "-";
    return new Date(value).toLocaleString();
  };

  return (
    <div
      className={
        "w-80 bg-surface flex items-center justify-center flex-col gap-4 border border-border p-4 max-w-md mx-auto relative overflow-hidden text-text-primary"
      }>
      {showPlaying}
      {showPlaying ? (
        <div className={"w-full"}>
          <div className={"flex items-center justify-center row-span-2"}>
            <CurrentlyPlayingData />
          </div>
        </div>
      ) : (
        <div className={"text-center text-gray-500"}>
          {currentlyPlaying?.watchID ? "Currently playing track is not recognized as music." : "No track playing."}
        </div>
      )}
      {currentlyPlaying?.watchID !== undefined ? (
        <div className={"text-sm space-y-1 text-text-secondary"}>
          {isReviewed && (
            <p>
              This track has been reviewed as {reviewInfo?.is_music ? "music" : "not music"} by admins. Further
              submissions are disabled.
            </p>
          )}

          {!isReviewed && isUserSubmission && (
            <p>
              You submitted a review for this track. If that was incorrect, please{" "}
              <span
                className={"text-blue-500 cursor-pointer"}
                onClick={() => deleteIsMusicReview(currentlyPlaying.watchID!)}>
                delete your review
              </span>
              .
            </p>
          )}

          {!isReviewed && !isUserSubmission && (
            <p>
              If you think this is {showPlaying ? "not " : ""}music, please{" "}
              <span
                className={"text-blue-500 cursor-pointer"}
                onClick={() => sendIsMusicReview(currentlyPlaying.watchID!, !showPlaying)}>
                submit a review
              </span>
              .
            </p>
          )}
        </div>
      ) : (
        <> If video is playing but not showing up, please report it.</>
      )}

      {currentlyPlaying && (
        <div className={"w-full border-t border-border pt-3"}>
          <button
            className={"text-sm font-medium text-blue-500 flex items-center gap-1"}
            onClick={() => setDetailsOpen(open => !open)}>
            <span>{detailsOpen ? "Hide details" : "Show details"}</span>
            <span>{detailsOpen ? "-" : "+"}</span>
          </button>

          {detailsOpen && (
            <div className={"mt-2 border border-border rounded-md p-3 bg-surface"}>
              <div className={"grid grid-cols-2 gap-x-2 gap-y-1 text-xs"}>
                <span className={"font-medium text-text-primary"}>Watch ID</span>
                <span className={"text-text-secondary break-all"}>{currentlyPlaying.watchID ?? "-"}</span>

                <span className={"font-medium text-text-primary"}>Title</span>
                <span className={"text-text-secondary"}>{currentlyPlaying.trackName ?? "-"}</span>

                <span className={"font-medium text-text-primary"}>Artist</span>
                <span className={"text-text-secondary"}>{currentlyPlaying.artistName ?? "-"}</span>

                <span className={"font-medium text-text-primary"}>Status</span>
                <span className={"text-text-secondary capitalize"}>{statusLabel}</span>

                <span className={"font-medium text-text-primary"}>Is music</span>
                <span className={"text-text-secondary"}>
                  {reviewInfo?.is_music === undefined ? "-" : reviewInfo.is_music ? "yes" : "no"}
                </span>

                <span className={"font-medium text-text-primary"}>Reviewed</span>
                <span className={"text-text-secondary"}>{reviewInfo?.reviewed ? "yes" : "no"}</span>

                <span className={"font-medium text-text-primary"}>User submission</span>
                <span className={"text-text-secondary"}>{reviewInfo?.user_submission ? "yes" : "no"}</span>

                <span className={"font-medium text-text-primary"}>Genres</span>
                <span className={"text-text-secondary"}>
                  {currentlyPlaying.genres?.genres.join(", ") ?? "Fetching genres..."}
                </span>

                <span className={"font-medium text-text-primary"}>Length</span>
                <span className={"text-text-secondary"}>{formatSeconds(currentlyPlaying.length)}</span>

                <span className={"font-medium text-text-primary"}>Current time</span>
                <span className={"text-text-secondary"}>{formatSeconds(currentlyPlaying.currentTime)}</span>

                <span className={"font-medium text-text-primary"}>Updated</span>
                <span className={"text-text-secondary"}>{formatTimestamp(currentlyPlaying.updatedAt)}</span>
              </div>

              {currentlyPlaying.NER && (
                <div className={"mt-3 text-xs"}>
                  <div className={"font-medium text-text-primary mb-1"}>NER</div>
                  <pre
                    className={
                      "whitespace-pre-wrap break-words text-text-secondary bg-surface border border-border rounded p-2 overflow-auto"
                    }>
                    {JSON.stringify(currentlyPlaying.NER, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
