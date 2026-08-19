// PyrexSpinna Central YouTube Data State
export let youtubeVideos: { id: string; title: string; videoId: string }[] = [];

export function addYouTubeVideo(title: string, urlOrId: string) {
  // Extract clean video ID from standard or shortened YouTube URLs
  let videoId = urlOrId;
  if (urlOrId.includes('youtube.com') || urlOrId.includes('youtu.be')) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlOrId.match(regExp);
    videoId = (match && match[2].length === 11) ? match[2] : urlOrId;
  }

  const newVideo = {
    id: `yt-${Date.now()}`,
    title: title,
    videoId: videoId
  };

  youtubeVideos.push(newVideo);
  return newVideo;
}
