import {MusicService} from "./MusicService";

export default class Youtube extends MusicService {
  public static async pullData() {
    const watchID = await Youtube.getWatchID();

    const data = {
      watchID: watchID,
    };
    return data;
  }

  private static async getWatchID() {
    return Youtube.getWatchIDURL();
  }
}
