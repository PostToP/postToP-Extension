import {MusicService} from "./MusicService";

export default class YoutubeMusic extends MusicService {
  public static async pullData() {
    const watchID = await YoutubeMusic.getWatchID();

    const data = {
      watchID: watchID,
    };
    return data;
  }

  private static async getWatchID() {
    const watchID =
      YoutubeMusic.getWatchIDURL() ??
      document
        .querySelector<HTMLAnchorElement>("a.ytp-title-link.yt-uix-sessionlink")
        ?.href.match(/v=([^&#]{5,})/)?.[1] ??
      "Unknown";
    return watchID;
  }
}
