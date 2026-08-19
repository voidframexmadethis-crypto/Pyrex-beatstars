
export const downloadTrack = (track: { title: string; downloadUrl?: string; audioUrl?: string }) => {
  const url = track.downloadUrl || track.audioUrl;
  if (!url) return;

  const link = document.createElement('a');
  link.href = url;
  link.download = `${track.title}.m4a`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
