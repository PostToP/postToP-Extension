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
