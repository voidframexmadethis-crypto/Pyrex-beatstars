export function shareTrack(platform: 'twitter' | 'whatsapp' | 'native', trackTitle: string, trackUrl: string) {
  const text = `Check out this new beat "${trackTitle}" on Pyrex Spinna Store! 🔥`;

  if (platform === 'native' && navigator.share) {
    navigator.share({
      title: trackTitle,
      text: text,
      url: trackUrl,
    }).catch(err => console.log('Share dismissed:', err));
    return;
  }

  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(trackUrl);

  let shareWindowUrl = '';
  if (platform === 'twitter') {
    shareWindowUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  } else if (platform === 'whatsapp') {
    shareWindowUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
  }

  if (shareWindowUrl) {
    window.open(shareWindowUrl, '_blank', 'width=600,height=400');
  }
}
