export class MusicService {
  public static async pullData(): Promise<any> {
    throw new Error("Method not implemented.");
  }

  public static currentTime(): number {
    return (
      document.querySelector<HTMLVideoElement>("video.video-stream")
        ?.currentTime ?? 0
    );
  }

  protected static getWatchIDURL() {
    const { href } = document.location;
    const watchID = href.match(/v=([^&#]{5,})/)?.[1];
    return watchID;
  }
}
