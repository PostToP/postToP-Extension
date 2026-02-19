import { MusicService } from "./MusicService";

export default class Youtube extends MusicService {
  public static async pullData() {
    const watchID = await Youtube.getWatchID();

    const data = {
      watchID: watchID,
    };
    return data;
  }

  private static async getWatchID() {
    return Youtube.getWatchIDURL() ?? Youtube.getWatchIDMiniplayer() ?? "Unknown";
  }

  private static getWatchIDMiniplayer() {
    const miniplayer = document.querySelector<HTMLAnchorElement>('ytd-playlist-panel-video-renderer[selected]  ytd-thumbnail>a')
    if (miniplayer) {
      const miniplayerHref = miniplayer.href;
      const miniplayerWatchID = miniplayerHref.match(/v=([^&#]{5,})/)?.[1];
      if (miniplayerWatchID) return miniplayerWatchID;
    }
  }
}
