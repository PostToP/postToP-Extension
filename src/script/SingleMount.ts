// @ts-expect-error
if (!window.__postToPInjected) {
  // @ts-expect-error
  window.__postToPInjected = true;
} else {
  throw Error("Already injected");
}
console.log("content_script.ts called");
