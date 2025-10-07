import {type ChromeMessageFrom, chromeSendMessageFactory} from "../common/Chrome";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: number;
}

export function createLogger(context: ChromeMessageFrom) {
  const send = chromeSendMessageFactory(context);

  async function log(level: LogLevel, message: string, data?: unknown) {
    const payload: LogPayload = {
      level,
      message,
      data,
      timestamp: Date.now(),
    };

    send("LOG", payload);
  }

  return {
    debug: (msg: string, data?: unknown) => log("debug", msg, data),
    info: (msg: string, data?: unknown) => log("info", msg, data),
    warn: (msg: string, data?: unknown) => log("warn", msg, data),
    error: (msg: string, data?: unknown) => log("error", msg, data),
  };
}
