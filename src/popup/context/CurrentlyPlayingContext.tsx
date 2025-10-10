import {createContext} from "preact";
import {useEffect, useState} from "preact/hooks";
import {CurrentlyPlaying} from "../../common/CurrentlyPlaying";
import {chromeReceiveMessage, chromeSendMessage} from "../Chrome";
import {log} from "../log";

export const CurrentlyPlayingContext = createContext<CurrentlyPlaying | null>(null);

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

  return <CurrentlyPlayingContext.Provider value={currentlyPlaying}>{children}</CurrentlyPlayingContext.Provider>;
}
