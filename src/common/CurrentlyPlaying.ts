
export enum VideoStatus {
  STARTED,
  PLAYING,
  PAUSED,
  ENDED,
}

export class CurrentlyPlaying {
  watchID?: string;
  trackName?: string;
  artistID?: string;
  artistName?: string;
  cover?: string;
  status?: VideoStatus;
  isMusic?: {
    is_music: boolean;
    reviewed: boolean;
  }
  length?: number;
  currentTime?: number;
  updatedAt?: number;
  constructor() { }

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
    this.watchID = args.watchID ?? this.watchID;
    this.trackName = args.trackName ?? this.trackName;
    this.artistID = args.artistID ?? this.artistID;
    this.artistName = args.artistName ?? this.artistName;
    this.cover = args.cover ?? this.cover;
    this.status = args.status ?? this.status;
    this.isMusic = args.isMusic ?? this.isMusic;
    this.length = args.length ?? this.length;
    this.currentTime = args.currentTime ?? this.currentTime;
    this.time = args.time ?? this.currentTime;
    this.updatedAt = args.updatedAt ?? this.updatedAt;
    this.update();
  }

  public set time(currentTime: number) {
    this.currentTime = currentTime;
    this.updatedAt = Date.now();
    this.update();
  }

  public get time() {
    if (this.updatedAt === undefined) return 0;
    if (this.currentTime === undefined) return 0;
    return (this.status === VideoStatus.PLAYING || this.status === VideoStatus.STARTED)
      ? (Date.now() - this.updatedAt + this.currentTime * 1000) / 1000
      : this.currentTime;
  }

  private updateEventListeners: Function[] = [];
  public onUpdate(callback: (currentlyPlaying: CurrentlyPlaying) => void) {
    this.updateEventListeners.push(callback);
  }
  private update() {
    this.updateEventListeners.forEach((cb) => cb(this));
  }

  private endEventListeners: Function[] = [];
  public onEnd(callback: (currentlyPlaying: CurrentlyPlaying) => void) {
    this.endEventListeners.push(callback);
  }
  private end() {
    this.endEventListeners.forEach((cb) => cb(this));
  }

  public endSong() {
    this.status = VideoStatus.ENDED;
    this.update();
    this.end();
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

  public safe() {
    return {
      watchID: this.watchID,
      trackName: this.trackName,
      artistID: this.artistID,
      artistName: this.artistName,
      cover: this.cover,
      status: this.status,
      isMusic: this.isMusic,
      length: this.length,
      currentTime: this.currentTime,
      updatedAt: this.updatedAt,
    };
  }
}
