export interface TrackAnalytics {
  trackId: string;
  globalStreams: number;
  estimatedRevenue: number;
  socialMentions: number;
  trendingScore: number;
}

export function calculateTrendingScore(streams: number, velocity: number): number {
  return Math.min(100, Math.round((streams * 0.4) + (velocity * 0.6)));
}

export { initGoogleAnalytics, trackEvent } from './gtag';

