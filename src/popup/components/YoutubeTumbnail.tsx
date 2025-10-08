export default function YoutubeThumbnail({imgURL}: {imgURL: string}) {
  if (!imgURL) {
    return (
      <div className="aspect-square flex justify-center items-center overflow-hidden rounded-xl bg-gray-300 dark:bg-gray-700">
        <span className="text-gray-500">No Image</span>
      </div>
    );
  }
  return (
    <div className="aspect-square flex justify-center items-center overflow-hidden rounded-xl">
      <img className="w-[135%] h-[135%] object-cover" alt="Cover" src={imgURL} />
    </div>
  );
}
