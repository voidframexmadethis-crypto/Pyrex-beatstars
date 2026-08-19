import React, { useState } from 'react';
import { addYouTubeVideo } from '../../lib/youtubeStore';
import { PlayCircle, Plus } from 'lucide-react';

export const AdminVideoManager = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleAddVideo = () => {
    if (!title || !url) {
      alert('Please provide both title and URL');
      return;
    }
    addYouTubeVideo(title, url);
    alert('Video added to vault!');
    setTitle('');
    setUrl('');
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
          <PlayCircle className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">YouTube Broadcast Manager</h2>
          <p className="text-neutral-400 text-sm">Add new video broadcasts to the Krypside video vault.</p>
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white"
        />
        <input
          type="text"
          placeholder="YouTube URL or ID"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white"
        />
        <button
          onClick={handleAddVideo}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Video
        </button>
      </div>
    </div>
  );
};
