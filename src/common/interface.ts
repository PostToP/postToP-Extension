import { RequestOperationType } from "./websocket";

export enum WSMessageType {
  MUSIC_LISTENED = RequestOperationType.MUSIC_ENDED,
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
  PAUSED = "PAUSED",
  PLAYING = "PLAYING",
  ENDED = "ENDED",
}

export interface IChromeMessage<T = any> {
  type: "GET" | "SET" | "ACTION";
  key: string;
  value?: T;
}

export interface IChromeResponse<T = any> {
  value: T;
}
