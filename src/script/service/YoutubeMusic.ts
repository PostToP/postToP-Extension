import { Decision } from "../../interface";
import { getMediaSessionInfo, waitforElement } from "../DOM";
import { MusicService } from "./MusicService";

export default class YoutubeMusic implements MusicService {
  public static async pullData() {
    const authorHandle = await this.getAuthorHandle();
    const watchID = await this.getWatchID();
    const mediaSession = await getMediaSessionInfo();
    const data = {
      watchID,
      trackName: mediaSession.title,
      artist: mediaSession.artist,
      cover: mediaSession.cover,
      authorHandle,
    };
    return data;
  }

  private static async getWatchID() {
    const { href } = document.location;
    const watchID =
      href.match(/v=([^&#]{5,})/)?.[1] ??
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
