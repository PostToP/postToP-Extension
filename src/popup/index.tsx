import {browser} from "../common/browser";
import "../style/globals.css";
import {render} from "preact";
import {useEffect, useState} from "preact/hooks";
import CurrentlyPlayingProvider from "./context/CurrentlyPlayingContext";
import Popup from "./popup";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    browser.storage.local.get(["authToken"]).then(result => {
      if (result.authToken) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  return loggedIn ? (
    <CurrentlyPlayingProvider>
      <Popup />
    </CurrentlyPlayingProvider>
  ) : (
    <div
      className={
        "w-80 bg-surface flex items-center justify-center flex-col gap-4 border border-border p-4 max-w-md mx-auto relative overflow-hidden text-text-primary"
      }>
      <h2 className="text-lg font-semibold">Not logged in</h2>
      <p className="text-center text-sm text-text-secondary">
        Please log in through the extension settings to view your currently playing media.
      </p>
      <button
        onClick={() => browser.runtime.openOptionsPage()}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm">
        Open Settings
      </button>
    </div>
  );
}

render(<App />, document.getElementById("root") || document.body);
