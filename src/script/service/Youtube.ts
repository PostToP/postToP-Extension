import { MusicService } from "./MusicService";

export default class Youtube extends MusicService {
  public static async pullData() {
    const watchID = await this.getWatchID();

    const data = {
      watchID: watchID,
    };
    return data;
  }

  private static async getWatchID() {
    return this.getWatchIDURL();
  }
}
