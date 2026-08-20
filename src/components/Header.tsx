import React, { useState } from 'react';

interface HeaderProps {
  setCurrentView?: (view: string) => void;
}

export default function Header({ setCurrentView }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 border-b border-purple-900/40 bg-black/40 backdrop-blur-md shrink-0 relative">
      <div 
        className="text-xl font-bold text-white tracking-wider cursor-pointer select-none"
        onClick={() => setCurrentView && setCurrentView('catalog')}
      >
        PyrexSpinna
      </div>

      <div className="relative">
        {/* The Producer Sign In / Profile Button */}
        <button
          id="producer-signin-btn"
          type="button"
          onClick={() => {
            console.log("Button clicked!");
            setIsOpen(!isOpen);
          }}
          className="bg-purple-900 hover:bg-purple-800 active:scale-95 text-white px-4 py-2 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-2 shadow-lg select-none"
        >
          <span>👤</span> Producer Sign In <span>▼</span>
        </button>

        {/* The Dropdown Menu */}
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <div 
              id="header-dropdown-menu"
              className="absolute right-0 mt-2 w-56 bg-zinc-950 border border-purple-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <button
                id="header-dropdown-profile-home"
                type="button"
                onClick={() => {
                  if (setCurrentView) setCurrentView('profile-home');
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-purple-200 hover:bg-purple-900 hover:text-white transition-all cursor-pointer block"
              >
                My Profile Home Page
              </button>
              <button
                id="header-dropdown-profile-settings"
                type="button"
                onClick={() => {
                  if (setCurrentView) setCurrentView('profile-settings');
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-purple-200 hover:bg-purple-900 hover:text-white transition-all cursor-pointer block"
              >
                Edit Profile Settings
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
