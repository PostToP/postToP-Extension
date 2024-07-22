export enum WSMessageType {
  MUSIC_LISTENED = "MUSIC_LISTENED",
  PING = "PING",
  PONG = "PONG",
}

export interface IRequest {
  type: WSMessageType;
  payload?: IMusic | object;
}

export interface IMusic {
  watchID: string;
  trackName: string;
  artist: string;
}

export enum Decision {
  NO,
  MAYBE,
  YES,
}

export enum MusicStatus {
  PAUSED,
  PLAYING,
}
