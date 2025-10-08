import {useEffect, useState} from "preact/hooks";
import {VideoStatus} from "../../common/CurrentlyPlaying";

export default function Timeline({
  currentTime,
  duration,
  playbackStatus,
}: {
  currentTime: number;
  duration: number;
  playbackStatus: VideoStatus;
}) {
  const [currentTimeState, setCurrentTimeState] = useState(currentTime);

  useEffect(() => {
    setCurrentTimeState(currentTime);
  }, [currentTime]);

  const isRunning =
    duration !== 0 && (playbackStatus === VideoStatus.PLAYING || playbackStatus === VideoStatus.STARTED);

  useEffect(() => {
    console.log("everything", {isRunning, playbackStatus, currentTimeState, duration});
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentTimeState(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const progress = duration > 0 ? (currentTimeState / duration) * 100 : 0;

  return (
    <div className="w-full px-4 py-2">
      <div className="relative w-full rounded-full h-1.5 bg-gray-700">
        <div
          className={`h-1.5 rounded-full w-full ${
            isRunning ? "bg-gradient-to-r from-red-500 to-red-700" : "bg-gray-400"
          }`}
          style={{maxWidth: `${progress}%`}}>
          <div
            className={`absolute size-3 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 ${isRunning ? "bg-gradient-to-r from-red-500 to-red-700" : "bg-gray-400"}`}
            style={{left: `${progress}%`}}></div>
        </div>
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span>{formatTime(currentTimeState)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return "0:00";
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
