import {useEffect, useState} from "preact/compat";

export function Time({seconds, frozen = false}: {seconds: number | undefined; frozen?: boolean}) {
  if (seconds === undefined || seconds < 0) {
    return <span>00:00:00</span>;
  }
  const [secondsState, setSecondsState] = useState(seconds);

  useEffect(() => {
    if (frozen) return;

    const interval = setInterval(() => {
      setSecondsState(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [frozen]);

  const h = Math.floor(secondsState / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((secondsState % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(secondsState % 60)
    .toString()
    .padStart(2, "0");

  return (
    <span>
      {h}:{m}:{s}
    </span>
  );
}
