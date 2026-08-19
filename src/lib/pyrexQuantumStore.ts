// ==========================================
// PYREX QUANTUM CORE: STANDALONE ZERO-KEY ENGINE
// ==========================================

export interface StandaloneTrack {
    id: string;
    title: string;
    producer: string;
    bpm: number | string;
    key: string;
    genre: string;
    price: number;
    artwork: string;
    audioSrc: string;
}

export interface QuantumStoreState {
    config: {
        storeName: string;
        tagline: string;
        currency: string;
    };
    tracks: StandaloneTrack[];
    cart: any[];
}

export class PyrexSpinnaQuantumStore {
    storageKey: string;

    constructor() {
        this.storageKey = "pyrex_standalone_vault_v1";
        this.initializeDefaultData();
    }

    // Initialize built-in catalog and zero-key storage so no AWS/external keys are required
    initializeDefaultData() {
        try {
            if (!localStorage.getItem(this.storageKey)) {
                const initialData: QuantumStoreState = {
                    config: {
                        storeName: "PYREX",
                        tagline: "Dark Trap & Southside Beats",
                        currency: "USD"
                    },
                    tracks: [],
                    cart: []
                };
                localStorage.setItem(this.storageKey, JSON.stringify(initialData));
            }
        } catch (e) {
            console.warn("Storage init notice:", e);
        }
    }

    // Get current store state
    getState(): QuantumStoreState {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) {
                this.initializeDefaultData();
                return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            }
            return JSON.parse(raw);
        } catch (e) {
            return {
                config: { storeName: "PYREX", tagline: "Dark Trap & Southside Beats", currency: "USD" },
                tracks: [],
                cart: []
            };
        }
    }

    // Add custom track and permanent artwork without needing external cloud buckets
    addTrack(trackData: { title: string; bpm: number | string; key: string; genre: string; price: number; audioSrc?: string }, artworkFile?: File): Promise<StandaloneTrack> {
        return new Promise((resolve) => {
            const processAndSave = (permanentArtworkUrl: string) => {
                const state = this.getState();
                
                const newTrack: StandaloneTrack = {
                    id: "track_" + Date.now(),
                    title: trackData.title,
                    producer: "PYREX",
                    bpm: trackData.bpm,
                    key: trackData.key,
                    genre: trackData.genre,
                    price: trackData.price,
                    artwork: permanentArtworkUrl,
                    audioSrc: trackData.audioSrc || "#"
                };

                state.tracks.unshift(newTrack);
                try {
                    localStorage.setItem(this.storageKey, JSON.stringify(state));
                } catch (e) {
                    console.warn("localStorage quota notice:", e);
                }
                resolve(newTrack);
            };

            if (artworkFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result as string || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60";
                    processAndSave(result);
                };
                reader.onerror = () => {
                    processAndSave("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60");
                };
                reader.readAsDataURL(artworkFile);
            } else {
                processAndSave("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60");
            }
        });
    }
}

// Fix checkout button glitch by locking event handling to immutable track IDs
export function renderPriceButton(track: { id: string; price: number }) {
    return `
        <button class="price-tag-btn" data-track-id="${track.id}" onclick="handleCheckout('${track.id}')">
            $${Number(track.price || 0).toFixed(2)}
        </button>
    `;
}

export function handleCheckout(trackId: string) {
    try {
        let targetTrack: any = null;
        
        // Check PyrexSpinnaLightVault first, then pyrex_standalone_vault_v1
        const rawLight = localStorage.getItem("PyrexSpinnaLightVault");
        if (rawLight) {
            const vaultData = JSON.parse(rawLight);
            targetTrack = vaultData.tracks?.find((t: any) => t.id === trackId);
        }

        if (!targetTrack) {
            const state = pyrexEngine.getState();
            targetTrack = state.tracks?.find((t: any) => t.id === trackId);
        }

        if (targetTrack) {
            console.log("Initiating secure checkout for:", targetTrack.title);
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('trigger-checkout', { detail: targetTrack }));
            }
        } else {
            console.warn("Track not found for checkout ID:", trackId);
        }
    } catch (e) {
        console.warn("Checkout handler notice:", e);
    }
}

// Global window attachments
if (typeof window !== 'undefined') {
    (window as any).renderPriceButton = renderPriceButton;
    (window as any).handleCheckout = handleCheckout;
}

// Initialize engine instance
export const pyrexEngine = new PyrexSpinnaQuantumStore();

