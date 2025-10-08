import {useContext} from "preact/hooks";
import {CurrentlyPlayingContext} from "../context/CurrentlyPlayingContext";

export default function BluredYTBg() {
  const currentlyListening = useContext(CurrentlyPlayingContext);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full -z-10 bg-cover bg-center filter blur-xl"
      style={{
        backgroundSize: "175%",
        backgroundImage: `url(${currentlyListening?.cover || ""})`,
        boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.6)",
      }}></div>
  );
}
