import { getMediaSessionInfo, waitforElementToChange } from "../DOM";
import { Decision } from "../../interface";
import { MusicService } from "./MusicService";

export default class Youtube implements MusicService {
  public static async pullData() {
    const authorHandle = this.getAuthorHandle();
    const watchID = this.getWatchID();
    const mediaSession = await getMediaSessionInfo();

    const data = {
      watchID: await watchID,
      trackName: mediaSession.title,
      artist: mediaSession.artist,
      cover: mediaSession.cover,
      authorHandle: await authorHandle,
    };
    return data;
  }

  private static async getWatchID() {
    const { href } = document.location;
    const watchID = href.match(/v=([^&#]{5,})/)?.[1] ?? "Unknown";
    return watchID;
  }

  private static getAuthorHandle(): Promise<string> {
    return new Promise((resolve, reject) => {
      let ifYoutubeDecidesToFastUpdate =
        document.querySelector<HTMLLinkElement>(
          "div#below a.ytd-video-owner-renderer"
        );

      waitforElementToChange("div#below a.ytd-video-owner-renderer")
        .then((e) => (e as HTMLLinkElement).href)
        .catch(() => ifYoutubeDecidesToFastUpdate?.href as string)
        .then((href) => {
          const parts = href?.split("/");
          const authorHandle = parts[parts.length - 1];
          resolve(authorHandle);
        });
    });
  }

  static titleRegex = /\W(MV|Cover|feat|ft|Music Video)(\W|$)/i;
  public static async determineIfSong() {
    const { title, artist } = await getMediaSessionInfo();
    if (this.titleRegex.test(title)) return Decision.YES;
    if (artist.endsWith(" - Topic")) return Decision.YES;

    const videoInfoDOM = document.getElementById("above-the-fold");
    const caruselTitle = videoInfoDOM?.querySelector(
      "yt-formatted-string#title.style-scope.ytd-rich-list-header-renderer"
    )?.innerHTML;
    if (caruselTitle === "Music") return Decision.YES;
    if (caruselTitle === "Shorts remixing this video") return Decision.YES;
    if (caruselTitle === "This will not happen") return Decision.NO;

    return Decision.MAYBE;
  }
}
