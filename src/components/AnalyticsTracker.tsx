import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { trackPageView } from '../utils/gtag';

export const AnalyticsTracker = () => {
  const { incrementAnalytics } = useStore();
  const location = useLocation();

  // Route Change Tracking
  useEffect(() => {
    trackPageView(location.pathname + location.search + location.hash);
  }, [location]);

  // Initial Visit Tracking
  useEffect(() => {
    incrementAnalytics('siteVisits');
    
    // Very simple visitor tracking: only count if not already visited in this session
    if (!sessionStorage.getItem('KRYPSIDE_VISITED')) {
      incrementAnalytics('uniqueVisitors');
      sessionStorage.setItem('KRYPSIDE_VISITED', 'true');
    }
  }, []);

  return null;
};
