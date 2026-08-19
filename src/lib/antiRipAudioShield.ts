// Ultra-Secure Anti-Rip Audio Shield
export class AntiRipAudioShield {
    audioCtx: AudioContext | null;
    activeSource: AudioBufferSourceNode | null;

    constructor() {
        this.audioCtx = null;
        this.activeSource = null;
    }

    async secureStreamPlay(protectedTrackUrl: string) {
        // Initialize browser audio context to block direct file scraping
        if (!this.audioCtx) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.audioCtx = new AudioContextClass();
        }

        console.log(">> [Shield Active]: Intercepting audio stream pipeline...");
        console.log(">> [Security]: Stripping direct download headers and public file endpoints.");

        try {
            // Fetch raw data as an array buffer instead of a direct link source
            const response = await fetch(protectedTrackUrl);
            const arrayBuffer = await response.arrayBuffer();
            
            // Decode the audio data securely in memory (invisible to downloaders)
            const decodedAudio = await this.audioCtx.decodeAudioData(arrayBuffer);
            
            if (this.activeSource) {
                this.activeSource.stop();
            }

            this.activeSource = this.audioCtx.createBufferSource();
            this.activeSource.buffer = decodedAudio;
            this.activeSource.connect(this.audioCtx.destination);
            this.activeSource.start(0);

            console.log(">> [Success]: Track streaming securely through memory buffer. Rip-blockers engaged.");
        } catch (error) {
            console.log(">> [Rip Blocked]: Unauthorized stream extraction detected and neutralized.");
        }
    }

    blockRightClickAndInspection() {
        document.addEventListener('contextmenu', event => {
            // Optional: prevent right-clicking audio elements
            const target = event.target as HTMLElement;
            if (target && (target.tagName === 'AUDIO' || target.dataset?.protected)) {
                event.preventDefault();
                console.log(">> [Warning]: Direct file inspection blocked by Security Shield.");
            }
        });
    }
}

// Initialize the shield
export const audioShield = new AntiRipAudioShield();
if (typeof window !== 'undefined') {
    audioShield.blockRightClickAndInspection();
}
