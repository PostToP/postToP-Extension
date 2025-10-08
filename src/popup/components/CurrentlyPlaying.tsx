import {useContext} from "preact/hooks";
import {CurrentlyPlayingContext} from "../context/CurrentlyPlayingContext";
import Timeline from "./Timeline";
import YoutubeThumbnail from "./YoutubeTumbnail";

export function CurrentlyPlayingData() {
  const currentlyPlaying = useContext(CurrentlyPlayingContext);

  return (
    <div className={"size-full p-4"}>
      <YoutubeThumbnail imgURL={currentlyPlaying?.cover || ""} />
      <div>
        <div className={"line-clamp-1 text-center font-bold text-lg"}>
          {currentlyPlaying?.trackName ? (
            <a
              href={`https://music.youtube.com/watch?v=${currentlyPlaying?.watchID}`}
              target="_blank"
              className="hover:underline ">
              {currentlyPlaying?.trackName}
            </a>
          ) : (
            <span>No track playing</span>
          )}
        </div>
        <div className={"line-clamp-1 text-center font-semibold text-md"}>
          {currentlyPlaying?.artistName && (
            <a
              href={`https://music.youtube.com/channel/${currentlyPlaying?.artistID}`}
              target="_blank"
              className="hover:underline">
              by {currentlyPlaying?.artistName}
            </a>
          )}
        </div>
        <div>
          <Timeline
            currentTime={currentlyPlaying?.time || 0}
            duration={currentlyPlaying?.length || 0}
            playbackStatus={currentlyPlaying?.status || 1}
          />
        </div>
      </div>
    </div>
  );
}
