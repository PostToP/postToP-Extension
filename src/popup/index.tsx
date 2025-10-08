import "../style/style.css";
import {render} from "preact";
import BluredYTBg from "./components/BluredYTBg";
import {CurrentlyPlayingData} from "./components/CurrentlyPlaying";
import DataThing from "./components/DataThing";
import CurrentlyPlayingProvider from "./context/CurrentlyPlayingContext";

function App() {
  return (
    <CurrentlyPlayingProvider>
      <BluredYTBg />
      <div className={"grid grid-cols-[1fr_1fr] grid-rows-[auto_40px] gap-2 w-full"}>
        <div className={"flex items-center justify-center row-span-2"}>
          <CurrentlyPlayingData />
        </div>
        <DataThing />
        <div className={"flex"}>
          <button
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-sm mr-2"
            type="button"
            onClick={() => chrome.runtime.openOptionsPage()}>
            <span className="flex items-center">Settings</span>
          </button>
        </div>
      </div>
    </CurrentlyPlayingProvider>
  );
}

render(<App />, document.getElementById("root") || document.body);
