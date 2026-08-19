import { youtubeVideos } from '../lib/youtubeStore';

export function PublicVideoFeed() {
  if (youtubeVideos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 font-mono text-xs uppercase">
        No active broadcasts in the Krypside video vault.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      {youtubeVideos.map((video) => (
        <div key={video.id} className="bg-gray-950 border border-blue-900/40 rounded-xl overflow-hidden p-4">
          <h4 className="text-white font-bold mb-3 text-sm">{video.title}</h4>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-800">
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}`}
              title={video.title}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      ))}
    </div>
  );
}
