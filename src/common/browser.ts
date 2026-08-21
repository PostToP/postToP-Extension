/** Firefox exposes the extension APIs as `browser`, Chromium as `chrome`. Only promise-based calls work on both. */
export const browser: typeof chrome = (globalThis as {browser?: typeof chrome}).browser ?? globalThis.chrome;
