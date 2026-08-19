import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Music, Layout, ShoppingCart, User, X, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';

interface CommandItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  action: () => void;
  producer?: string;
}

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { state } = useStore();
  const { beats } = state;
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredBeats = beats.filter(beat => 
    beat.title.toLowerCase().includes(search.toLowerCase()) ||
    beat.producer.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  const commands = [
    { id: 'home', title: 'Go to Home', icon: <Layout size={18} />, action: () => navigate('/') },
    { id: 'store', title: 'Browse Store', icon: <ShoppingCart size={18} />, action: () => navigate('/store') },
    { id: 'profile', title: 'View Profile', icon: <User size={18} />, action: () => navigate('/profile') },
  ];

  const results: CommandItem[] = [...commands, ...filteredBeats.map(beat => ({
    id: `beat-${beat.id}`,
    title: beat.title,
    producer: beat.producer,
    icon: <Music size={18} />,
    action: () => navigate(`/player/${beat.id}`)
  }))].filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }

      if (isOpen) {
        if (e.key === 'Escape') setIsOpen(false);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          if (results[selectedIndex]) {
            results[selectedIndex].action();
            setIsOpen(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden relative z-10"
          >
            <div className="flex items-center px-4 py-3 border-b border-neutral-800 gap-3">
              <Search className="text-neutral-500" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search beats..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-neutral-500 text-lg py-1"
              />
              <div className="flex items-center gap-1.5 bg-neutral-800 px-2 py-1 rounded-md text-[10px] font-bold text-neutral-400 uppercase tracking-widest border border-neutral-700">
                <Command size={10} /> K
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length > 0 ? (
                results.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                      idx === selectedIndex ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    <span className={idx === selectedIndex ? 'text-white' : 'text-neutral-500'}>
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{item.title}</div>
                      {'producer' in item && (
                        <div className={`text-[10px] ${idx === selectedIndex ? 'text-indigo-200' : 'text-neutral-600'}`}>
                          by {item.producer}
                        </div>
                      )}
                    </div>
                    {idx === selectedIndex && (
                      <div className="text-[10px] font-bold opacity-60">ENTER</div>
                    )}
                  </button>
                ))
              ) : (
                <div className="py-12 text-center text-neutral-500">
                  No results found for "{search}"
                </div>
              )}
            </div>
            
            <div className="bg-black/40 px-4 py-2 flex items-center justify-between border-t border-neutral-800/50">
              <div className="flex gap-4 text-[10px] text-neutral-500 font-bold tracking-widest uppercase">
                <div className="flex items-center gap-1.5"><kbd className="bg-neutral-800 px-1 rounded border border-neutral-700">↑↓</kbd> Navigate</div>
                <div className="flex items-center gap-1.5"><kbd className="bg-neutral-800 px-1 rounded border border-neutral-700">ESC</kbd> Close</div>
              </div>
              <div className="text-[10px] text-neutral-600 font-medium italic">KRYPSIDE v1.0</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
