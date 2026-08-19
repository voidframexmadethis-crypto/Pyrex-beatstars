import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const STORAGE_KEY_LAST_PATH = 'pyrex_last_active_path';
export const STORAGE_KEY_ACTIVE_TAB = 'pyrex_active_tab';
export const STORAGE_KEY_LAST_ROUTE = 'pyrex_last_route';

export type NavigationTab = 
  | 'homepage' 
  | 'feed' 
  | 'collections' 
  | 'audio-player' 
  | 'videos' 
  | 'services' 
  | 'upload' 
  | 'admin';

/**
 * Maps a URL pathname to its corresponding high-level tab name
 */
export function getTabForPath(pathname: string): NavigationTab {
  const clean = pathname.toLowerCase();
  if (clean === '/' || clean === '') return 'homepage';
  if (clean.startsWith('/feed')) return 'feed';
  if (clean.startsWith('/storefront') || clean.startsWith('/beats') || clean.startsWith('/store')) return 'collections';
  if (clean.startsWith('/audio-player') || clean.startsWith('/player') || clean.startsWith('/beat/') || clean.startsWith('/track/') || clean.startsWith('/music/')) return 'audio-player';
  if (clean.startsWith('/videos') || clean.startsWith('/youtube')) return 'videos';
  if (clean.startsWith('/enterprise') || clean.startsWith('/services')) return 'services';
  if (clean.startsWith('/upload') || clean.startsWith('/uploader')) return 'upload';
  if (clean.startsWith('/admin')) return 'admin';
  return 'homepage';
}

/**
 * Maps a tab identifier back to its canonical primary route
 */
export function getPathForTab(tab: string): string {
  switch (tab.toLowerCase()) {
    case 'feed':
      return '/feed';
    case 'collections':
    case 'storefront':
    case 'store':
      return '/storefront';
    case 'audio-player':
    case 'player':
    case 'music':
      return '/audio-player';
    case 'videos':
    case 'youtube':
      return '/videos';
    case 'services':
    case 'enterprise':
      return '/enterprise';
    case 'upload':
    case 'uploader':
      return '/upload';
    case 'admin':
    case 'admin-portal':
      return '/admin';
    case 'homepage':
    case 'home':
    default:
      return '/';
  }
}

/**
 * NavigationRestorer Component
 * - Persists current active route, tab, and full search parameters to localStorage.
 * - Restores the exact saved page/tab upon page reload or browser refresh.
 */
export default function NavigationRestorer() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasRestoredRef = useRef(false);

  // 1. Initial Mount: Check and restore last active route if on default root
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    try {
      // Inspect browser hash and current router pathname
      const currentHash = typeof window !== 'undefined' ? window.location.hash : '';
      const isDefaultRoot = !currentHash || currentHash === '#' || currentHash === '#/' || (location.pathname === '/' && !location.search);

      const savedPath = localStorage.getItem(STORAGE_KEY_LAST_PATH);
      const savedRoute = localStorage.getItem(STORAGE_KEY_LAST_ROUTE);
      const savedTab = localStorage.getItem(STORAGE_KEY_ACTIVE_TAB);

      // Candidate target path to restore
      let targetPathToRestore = savedPath || savedRoute || (savedTab ? getPathForTab(savedTab) : null);

      if (isDefaultRoot && targetPathToRestore && targetPathToRestore !== '/' && targetPathToRestore !== '#/') {
        // Normalize target path
        if (targetPathToRestore.startsWith('#/')) {
          targetPathToRestore = targetPathToRestore.substring(1);
        } else if (targetPathToRestore.startsWith('#')) {
          targetPathToRestore = targetPathToRestore.substring(1);
        }

        if (targetPathToRestore.startsWith('/')) {
          console.log(`[NavigationRestorer] 🔄 Automatically restoring last active page/tab: "${targetPathToRestore}"`);
          navigate(targetPathToRestore, { replace: true });
          return;
        }
      }

      // If user landed on a concrete route directly (e.g., #/feed), save current location
      const fullCurrentPath = `${location.pathname}${location.search}${location.hash}`;
      const activeTab = getTabForPath(location.pathname);
      localStorage.setItem(STORAGE_KEY_LAST_PATH, fullCurrentPath);
      localStorage.setItem(STORAGE_KEY_LAST_ROUTE, location.pathname);
      localStorage.setItem(STORAGE_KEY_ACTIVE_TAB, activeTab);
    } catch (e) {
      console.warn('[NavigationRestorer] Error during route restoration:', e);
    }
  }, []);

  // 2. Continuous Persistence: Save active route/tab on every location change
  useEffect(() => {
    try {
      const fullPath = `${location.pathname}${location.search}${location.hash}`;
      const activeTab = getTabForPath(location.pathname);

      localStorage.setItem(STORAGE_KEY_LAST_PATH, fullPath);
      localStorage.setItem(STORAGE_KEY_LAST_ROUTE, location.pathname);
      localStorage.setItem(STORAGE_KEY_ACTIVE_TAB, activeTab);

      // Dispatch route change event for components that observe navigation state
      window.dispatchEvent(
        new CustomEvent('pyrex_navigation_updated', {
          detail: {
            path: fullPath,
            route: location.pathname,
            tab: activeTab
          }
        })
      );
    } catch (e) {
      console.warn('[NavigationRestorer] Error saving active route:', e);
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
}
