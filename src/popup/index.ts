import { CurrentlyPlaying } from "../common/CurrentlyPlaying";
import { setCurrentlyPlayingDOM, $id } from "./DOM";
import "./Serialization";
import "./Loader";
import { chromeReceiveMessage } from "../common/Chrome";

$id("filterButton")?.addEventListener("click", handleFilter);
$id("loginButton")?.addEventListener("click", handleLogin);

function handleFilter() {
  let server = ($id("webSocketURL") as HTMLInputElement)!.value;
  server = server.replace("ws://", "http://") + "/filter";
  fetch(server, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      watchID: currentlyPlaying.watchID,
    }),
  });
}

export let currentlyPlaying = new CurrentlyPlaying()
export function setCurrentlyPlaying(cp: CurrentlyPlaying) {
  currentlyPlaying.setValues(cp);
  setCurrentlyPlayingDOM(currentlyPlaying);
}

// script to popup
chromeReceiveMessage(
  "GET_CURRENTLY_PLAYING",
  (data) => {
    setCurrentlyPlaying(data.value);
  }
);
function handleLogin(this: HTMLElement, ev: MouseEvent) {
  ev.preventDefault();
  const username = ($id("username") as HTMLInputElement).value;
  const password = ($id("password") as HTMLInputElement).value;

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  const server = ($id("webSocketURL") as HTMLInputElement).value;
  const loginURL = server.replace("ws://", "http://") + "/auth";
  const queryParams = new URLSearchParams({
    username: username,
    password: password,
  }).toString();

  fetch(loginURL + "?" + queryParams, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed1: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      alert("Login successful!");
      chrome.storage.local.set({ authToken: data.token });
    })
    .catch((error) => {
      console.error("Error during login:", error);
      alert("Login failed3: " + error.message);
    }
    );
  return false;
}

