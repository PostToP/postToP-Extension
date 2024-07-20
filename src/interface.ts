export enum MessageType {
  MUSIC = "MUSIC",
  PING = "PING",
  PONG = "PONG",
}

export interface IRequest {
  type: MessageType;
  payload?: IMusic | object;
}

export interface IMusic {
  watchID: string;
  trackName: string;
  artist: string;
}

export enum Decision {
  YES,
  MAYBE,
  NO,
}

export enum MusicStatus {
  PLAYING,
  PAUSED,
}
