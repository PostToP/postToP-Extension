import {createContext} from "preact";
import {useEffect, useState} from "preact/hooks";
import {CurrentlyPlaying} from "../../common/CurrentlyPlaying";
import {AuthRepository} from "../../common/repository/AuthRepository";
import {SettingsRepository} from "../../common/repository/SettingsRepository";
import {chromeReceiveMessage, chromeSendMessage} from "../Chrome";
import {log} from "../log";

export const CurrentlyPlayingContext = createContext<CurrentlyPlaying | null>(null);

async function submitReview(watchID: string, isMusic: boolean) {
  const token = await AuthRepository.getAuthToken();
  const address = await SettingsRepository.getSetting("serverAddress");
  const url = `http://${address}/review/music`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
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

export default function CurrentlyPlayingProvider({children}: {children: preact.ComponentChildren}) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying | null>(null);

  function updateCurrentlyPlaying(newCP: CurrentlyPlaying) {
    setCurrentlyPlaying(prev => {
      const updated = prev ? CurrentlyPlaying.copy(prev) : new CurrentlyPlaying();
      updated.setValues(newCP);
      return updated;
    });
  }

  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      try {
        const response = await chromeSendMessage("GET_CURRENTLY_PLAYING");
        if (response?.value) {
          updateCurrentlyPlaying(response.value);
          log.debug(`Currently playing data fetched`, response.value);
        }
      } catch (error) {
        log.error(`Error fetching currently playing`, error);
      }
    };
    fetchCurrentlyPlaying();

    chromeReceiveMessage("VIDEO_UPDATE", request => {
      log.debug("Received VIDEO_UPDATE", request);
      updateCurrentlyPlaying(request.value.value);
    });
  }, []);

  const sendReview = (isMusic: boolean) => {
    if (!currentlyPlaying) return;
    submitReview(currentlyPlaying.watchID!, isMusic);
  };

  return <CurrentlyPlayingContext.Provider value={currentlyPlaying}>{children}</CurrentlyPlayingContext.Provider>;
}
