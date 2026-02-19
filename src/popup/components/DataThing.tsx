import { useContext } from "preact/hooks";
import { CurrentlyPlayingContext } from "../context/CurrentlyPlayingContext";

export default function DataThing() {
  const currentlyPlaying = useContext(CurrentlyPlayingContext);

  return (
    <div className="rounded-lg p-2">
      <div>
        <h3 className="text-lg font-semibold text-center">
          Is Music{" "}
          {currentlyPlaying?.isMusic?.reviewed && (
            <span className="ml-1 text-sm text-green-600 font-normal">(Reviewed)</span>
          )}
        </h3>
        <p className="text-center text-xl font-bold">
          {currentlyPlaying?.isMusic?.is_music ? (
            <span className="text-green-600">Yes</span>
          ) : (
            <span className="text-red-600">No</span>
          )}
        </p>
      </div>

      {currentlyPlaying?.isMusic?.is_music && (
        <div>
          <div>
            <h3 className="text-lg font-semibold text-center">Named Entities</h3>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-medium">Main Artist</td>
                  <td className="text-right text-gray-700">{currentlyPlaying.NER?.ORIGINAL_AUTHOR[0] || "Unknown"}</td>
                </tr>
                <tr>
                  <td className="font-medium">Title</td>
                  <td className="text-right text-gray-700">{currentlyPlaying.NER?.TITLE[0] || "Unknown"}</td>
                </tr>
                <tr>
                  <td className="font-medium">Featuring</td>
                  <td className="text-right text-gray-700">{currentlyPlaying.NER?.FEATURING.join(", ") || "None"}</td>
                </tr>
                <tr>
                  <td className="font-medium">Vocal</td>
                  <td className="text-right text-gray-700">{currentlyPlaying.NER?.VOCALIST.join(", ") || "None"}</td>
                </tr>
                <tr>
                  <td className="font-medium">Album</td>
                  <td className="text-right text-gray-700">{currentlyPlaying.NER?.ALBUM[0] || "Unknown"}</td>
                </tr>
                <tr>
                  <td className="font-medium">Modifier</td>
                  <td className="text-right text-gray-700">{currentlyPlaying.NER?.MODIFIER.join(", ") || "None"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-center">Genre</h3>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-medium">Genre</td>
                  <td className="text-right text-gray-700">TODO</td>
                </tr>
                <tr>
                  <td className="font-medium">Subgenre</td>
                  <td className="text-right text-gray-700">TODO</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
