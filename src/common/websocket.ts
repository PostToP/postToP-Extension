export enum RequestOperationType {
    AUTH = 1,
    EAVESDROP = 2,
    HEARTBEAT = 3,
    MUSIC_STARTED = 4,
    MUSIC_UPDATE = 5,
    MUSIC_ENDED = 6,
}

export enum ResponseOperationType {
    DECLARE_INTENT = 100,
    AUTHENTICATED = 101,
    EAVESDROPPED = 102,
    PONG = 103,
    MUSIC_STARTED = 104,
    MUSIC_UPDATE = 105,
    MUSIC_ENDED = 106,
    REQUEST_STATUS = 107,
    ERROR = 400,
}

export interface WebSocketRequest {
    op: RequestOperationType;
    d: WebsocketData;
}

export interface WebSocketResponse {
    op: ResponseOperationType;
    d: WebsocketData;
}

interface WebsocketData extends Object { }

export interface VideoRequestData extends WebsocketData {
    watchID: string;
}

