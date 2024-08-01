import { Decision } from "../../interface";
import { getMediaSessionInfo, waitforElement } from "../DOM";
import { MusicService } from "./MusicService";

export default class YoutubeMusic extends MusicService {
  public static async pullData() {
    const authorHandle = this.getAuthorHandle();
    const watchID = this.getWatchID();
    const length = this.getVideoLength();
    const mediaSession = await getMediaSessionInfo();
    const data = {
      watchID: await watchID,
      trackName: mediaSession.title,
      artist: mediaSession.artist,
      cover: mediaSession.cover,
      authorHandle: await authorHandle,
      length: await length,
    };
    return data;
  }

  private static async getWatchID() {
    const watchID =
      this.getWatchIDURL ??
      document
        .querySelector<HTMLAnchorElement>("a.ytp-title-link.yt-uix-sessionlink")
        ?.href.match(/v=([^&#]{5,})/)?.[1] ??
      "Unknown";
    return watchID;
  }

  private static async getAuthorHandle() {
    let authorLink = (
      (await waitforElement("ytmusic-player-bar a")) as HTMLLinkElement
    )?.href;
    if (!authorLink) return "Unknown";
    const temp = authorLink?.split("/");
    const authorHandle = temp[temp.length - 1];
    return authorHandle;
  }

  public static async determineIfSong() {
    return Decision.YES;
  }
}
