import { Decision, MusicStatus } from "./interface";

export class CurrentlyPlaying {
  watchID?: string;
  trackName?: string;
  artistID?: string;
  artistName?: string;
  cover?: string;
  status?: MusicStatus;
  isMusic?: Decision;
  length?: number;
  currentTime?: number;
  updatedAt?: number;
  constructor() {}

  public static copy(copy: CurrentlyPlaying) {
    const newCurrentlyPlaying = new CurrentlyPlaying();
    newCurrentlyPlaying.watchID = copy.watchID;
    newCurrentlyPlaying.trackName = copy.trackName;
    newCurrentlyPlaying.artistID = copy.artistID;
    newCurrentlyPlaying.artistName = copy.artistName;
    newCurrentlyPlaying.cover = copy.cover;
    newCurrentlyPlaying.status = copy.status;
    newCurrentlyPlaying.isMusic = copy.isMusic;
    newCurrentlyPlaying.length = copy.length;
    newCurrentlyPlaying.currentTime = copy.currentTime;
    newCurrentlyPlaying.updatedAt = copy.updatedAt;
    return newCurrentlyPlaying;
  }

  public setValues(args: any) {
    this.watchID = args.watchID || this.watchID;
    this.trackName = args.trackName || this.trackName;
    this.artistID = args.artistID || this.artistID;
    this.artistName = args.artistName || this.artistName;
    this.cover = args.cover || this.cover;
    this.status = args.status || this.status;
    this.isMusic = args.isMusic || this.isMusic;
    this.length = args.length || this.length;
    this.currentTime = args.currentTime || this.currentTime;
    this.updatedAt = args.updatedAt || this.updatedAt;
    this.update();
  }

  public set time(currentTime: number) {
    this.currentTime = currentTime;
    this.updatedAt = Date.now();
    this.update();
  }

  public get time() {
    if (!this.updatedAt) return 0;
    if (!this.currentTime) return 0;
    return this.status === MusicStatus.PLAYING
      ? (Date.now() - this.updatedAt + this.currentTime * 1000) / 1000
      : this.currentTime;
  }

  private eventListeners: Function[] = [];
  public onUpdate(callback: (currentlyPlaying: CurrentlyPlaying) => void) {
    this.eventListeners.push(callback);
  }

  private update() {
    this.eventListeners.forEach((cb) => cb(this));
  }

  public clear() {
    this.watchID = undefined;
    this.trackName = undefined;
    this.artistID = undefined;
    this.artistName = undefined;
    this.cover = undefined;
    this.status = undefined;
    this.isMusic = undefined;
    this.length = undefined;
    this.currentTime = undefined;
    this.updatedAt = undefined;
    this.update();
  }
}
