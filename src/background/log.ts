// fake/mock logger since MV3 doesnt allow self-messaging, even though 5 months ago it was allowed and caused bugs
function formatMessage(msg: string) {
  return `[BACKGROUND] ${new Date().toISOString()} - ${msg}`;
}

export const log = {
  debug: (msg: string, data?: unknown) => console.debug(formatMessage(msg), data),
  info: (msg: string, data?: unknown) => console.info(formatMessage(msg), data),
  warn: (msg: string, data?: unknown) => console.warn(formatMessage(msg), data),
  error: (msg: string, data?: unknown) => console.error(formatMessage(msg), data),
};
