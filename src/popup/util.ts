export function secondsToHms(d: number) {
  const hours = Math.floor(d / 3600);
  const minutes = Math.floor((d % 3600) / 60);
  const seconds = Math.floor((d % 3600) % 60);

  const hoursDisplay = hours.toString().padStart(2, "0");
  const minutesDisplay = minutes.toString().padStart(2, "0");
  const secondsDisplay = seconds.toString().padStart(2, "0");

  return `${hoursDisplay}:${minutesDisplay}:${secondsDisplay}`;
}
