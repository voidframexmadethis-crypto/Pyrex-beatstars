
const APP_VERSION = "2.0.0-PYREX";

export const clearEverything = async () => {
    // 1. Clear LocalStorage
    localStorage.clear();
    
    // 2. Clear IndexedDBs
    try {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name) {
          await indexedDB.deleteDatabase(db.name);
        }
      }
    } catch (e) {
      console.error("[CacheBuster] Error wiping IndexedDB:", e);
    }
    
    // 3. Unregister Service Workers
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    } catch (e) {
      console.error("[CacheBuster] Error unregistering SW:", e);
    }
    
    localStorage.setItem('app_version', APP_VERSION);
    window.location.reload();
};

export const performCacheBuster = async () => {
  const currentVersion = localStorage.getItem('app_version');
  
  if (currentVersion !== APP_VERSION) {
    console.log(`[CacheBuster] Version mismatch: ${currentVersion} -> ${APP_VERSION}. Wiping state...`);
    await clearEverything();
  }
};
