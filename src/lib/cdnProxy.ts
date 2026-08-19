// Cloudflare R2 / External CDN Media Asset Redirection Proxy
// Directs audio stream requests to local endpoints or external URLs safely without breaking playback.

export function getOptimizedMediaUrl(assetPath: string | undefined): string {
  if (!assetPath) {
    return '';
  }

  // Check if the asset is already an absolute external link, blob, or data URI
  if (
    assetPath.startsWith('http://') || 
    assetPath.startsWith('https://') || 
    assetPath.startsWith('blob:') || 
    assetPath.startsWith('data:')
  ) {
    return assetPath;
  }
  
  // Return local relative path so Express server handles streaming directly
  if (assetPath.startsWith('/')) {
    return assetPath;
  }

  return `/${assetPath}`;
}

// Intercept audio player source loading to resolve stream URLs cleanly
if (typeof window !== 'undefined') {
  window.resolvePyrexSpinnaAudioStream = function(trackObject: any) {
    if (!trackObject) return '';
    const rawAudioUrl = trackObject.watermarkedAudioUrl || trackObject.audioUrl || trackObject.fileUrl || trackObject.file;
    const optimizedUrl = getOptimizedMediaUrl(rawAudioUrl);
    return optimizedUrl;
  };
}

