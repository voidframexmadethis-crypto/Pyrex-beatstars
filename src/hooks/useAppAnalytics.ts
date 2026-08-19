import { useEffect } from 'react';
import { initGoogleAnalytics } from '../utils/gtag';

export function useAppAnalytics() {
  useEffect(() => {
    initGoogleAnalytics();
  }, []);
}
