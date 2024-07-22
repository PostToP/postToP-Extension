export async function isSongAvailableOnYTAPI() {
  const { href } = document.location;

  const watchID = href.match(/v=([^&#]{5,})/)?.[1];
  const lemnsolife = await fetch(
    "https://yt.lemnoslife.com/videos?part=music&id=" + watchID
  );
  const json = await lemnsolife.json();
  return json.items[0].music.available;
}
