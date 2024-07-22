export function waitforElement(selector: string): Promise<Element> {
  return new Promise((resolve, reject) => {
    let counter = 0;
    const interval = setInterval(() => {
      if (counter > 20) {
        clearInterval(interval);
        reject("Element not found");
      }
      counter++;
      if (document.querySelector(selector)) {
        clearInterval(interval);
        resolve(document.querySelector(selector) as Element);
      }
    }, 200);
  });
}

export function waitforElementToChange(selector: string): Promise<Element> {
  return new Promise((resolve, reject) => {
    let exists = document.querySelector(selector) as Element;
    let failsafe = setTimeout(() => {
      observer.disconnect();
      reject("Element not found");
    }, 5000);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          clearTimeout(failsafe);
          observer.disconnect();
          resolve(mutation.target as Element);
        }
      });
    });
    observer.observe(exists, {
      attributes: true,
    });
  });
}

export async function getMediaSessionInfo() {
  let title = navigator.mediaSession.metadata?.title || "Unknown";
  let artist = navigator.mediaSession.metadata?.artist || "Unknown";
  let cover = navigator.mediaSession.metadata?.artwork[0].src || "Unknown";

  return { title, artist, cover };
}
