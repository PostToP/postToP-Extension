// @ts-ignore
if (!window.__postToPInjected) {
  // @ts-ignore
  window.__postToPInjected = true;
} else {
  throw Error("Already injected");
}
console.log("content_script.ts called");
