
import React from 'react';

export const AdminReset: React.FC = () => {
  const handleReset = async () => {
    if (confirm("Are you sure you want to force clear all site data, cache, and reload?")) {
      localStorage.clear();
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name) await indexedDB.deleteDatabase(db.name);
      }
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      window.location.reload();
    }
  };

  return (
    <button 
      onClick={handleReset}
      className="text-[10px] text-neutral-600 hover:text-red-500 underline transition-colors"
    >
      Force Clear Site Cache
    </button>
  );
};
