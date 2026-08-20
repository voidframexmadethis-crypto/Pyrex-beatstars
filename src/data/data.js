// 1. Store your track data cleanly (this can live in a separate data.js file or local state)
export const initialBeatCatalog = [
  {
    id: "beat-001",
    title: "Costly",
    bpm: 128,
    key: "B Minor",
    genre: "Trap",
    price: 29.99,
    audioUrl: "https://archive.org/download/test-audio-sample/sample.m4a",
    artwork: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "beat-002",
    title: "Midnight Mirage",
    bpm: 140,
    key: "C Minor",
    genre: "Dark Trap",
    price: 35.00,
    audioUrl: "",
    artwork: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60"
  }
];

export default initialBeatCatalog;
