import {log} from "./log";

// @ts-expect-error
if (!window.__postToPInjected) {
  // @ts-expect-error
  window.__postToPInjected = true;
} else {
  throw Error("Already injected");
}
log.info(`content_script.ts called`);
