import {render} from "preact";
import {CurrentlyPlayingData} from "./components/CurrentlyPlaying";

function App() {
  return (
    <>
      <button type="button" onClick={() => chrome.runtime.openOptionsPage()}>
        Go To Settings
      </button>
      <CurrentlyPlayingData />
    </>
  );
}

render(<App />, document.getElementById("root") || document.body);
