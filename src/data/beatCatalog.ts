// 1. Store your track data cleanly (this can live in a separate data.js file or local state)
export interface CatalogBeat {
  id: string | number;
  title: string;
  bpm?: number | string;
  key?: string;
  genre?: string;
  price?: number;
  audioUrl?: string;
  artwork: string;
  coverUrl?: string;
}

export const initialTracks: CatalogBeat[] = [
  {
    id: "costly-1",
    title: "Costly",
    artwork: "/src/assets/images/mxbeatz_cover_1786266753719.jpg",
    price: 49.99,
    audioUrl: "",
    bpm: 128,
    key: "B Minor",
    genre: "Trap"
  },
  {
    id: "trap-vol-1",
    title: "Trap Vol 1",
    artwork: "/src/assets/images/trap_vol1_art_1787016520272.jpg",
    price: 49.99,
    audioUrl: "",
    bpm: 140,
    key: "C Minor",
    genre: "Trap"
  },
  {
    id: "trap-vol-2",
    title: "Trap Vol 2",
    artwork: "/src/assets/images/trap_vol2_art_1787016554260.jpg",
    price: 49.99,
    audioUrl: "",
    bpm: 145,
    key: "D Minor",
    genre: "Trap"
  },
  {
    id: "trap-vol-3",
    title: "Trap Vol 3",
    artwork: "/src/assets/images/trap_vol3_art_1787016564316.jpg",
    price: 49.99,
    audioUrl: "",
    bpm: 130,
    key: "G Minor",
    genre: "Trap"
  },
  {
    id: "trap-vol-4",
    title: "Trap Vol 4",
    artwork: "/src/assets/images/trap_vol4_art_1787016573765.jpg",
    price: 49.99,
    audioUrl: "",
    bpm: 150,
    key: "A Minor",
    genre: "Trap"
  }
];

export const initialBeatCatalog = initialTracks;

export default initialTracks;
