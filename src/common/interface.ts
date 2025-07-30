export interface IChromeMessage<T = any> {
  type: "GET" | "SET" | "ACTION";
  key: string;
  value?: T;
}

export interface IChromeResponse<T = any> {
  value: T;
}

export enum VideoStatus {
  PLAYING,
  PAUSED,
  ENDED,
}