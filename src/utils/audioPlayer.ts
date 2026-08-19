export class BulletproofAudioPlayer {
  private audioElement: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private currentSrc: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.setupErrorListeners();
    }
  }

  private getOrCreateAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        try {
          this.audioCtx = new AudioCtxClass();
          (window as any).globalAudioCtx = this.audioCtx;
        } catch (e) {
          console.warn('[AUDIO CONTEXT CREATION WARNING]:', e);
        }
      }
    }
    return this.audioCtx;
  }

  private async ensureAudioContextResumed() {
    const audioCtx = this.getOrCreateAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') {
      try {
        await audioCtx.resume();
        console.log('[AUDIO CONTEXT]: Resumed suspended AudioContext on user gesture.');
      } catch (e) {
        console.warn('[AUDIO CONTEXT RESUME WARNING]:', e);
      }
    }
  }

  private setupErrorListeners() {
    if (!this.audioElement) return;

    this.audioElement.addEventListener('error', (e) => {
      const error = (e.target as HTMLAudioElement).error;
      console.error('[AUDIO ERROR DETECTED]:', {
        code: error?.code,
        message: error?.message,
        src: this.currentSrc
      });
    });
  }

  public async playTrack(audioUrl: string, mimeType: string = 'audio/mp4'): Promise<boolean> {
    if (!this.audioElement) return false;

    // 1. Explicitly check and resume the browser's AudioContext state
    await this.ensureAudioContextResumed();

    let targetUrl = audioUrl;

    try {
      // If source is missing, detached, or changed, re-initialize
      if (this.currentSrc !== targetUrl || !this.audioElement.src || this.audioElement.src === '' || this.audioElement.src.endsWith('/null')) {
        this.audioElement.src = targetUrl;
        this.currentSrc = targetUrl;
        this.audioElement.load();
      }

      // 2. Wrap audioElement.play() execution in a proper Promise catch block
      await this.audioElement.play();
      return true;
    } catch (error: any) {
      console.warn('[PLAYBACK BLOCKED OR INTERRUPTED]: Attempting recovery and blob source re-initialization...', error);
      
      // Fallback recovery attempt: re-initialize source URL and retry
      try {
        if (!targetUrl || targetUrl.startsWith('blob:')) {
          const savedBeat = typeof localStorage !== 'undefined' ? localStorage.getItem('myPermanentBeat') : null;
          if (savedBeat) {
            targetUrl = savedBeat;
          }
        }
        this.audioElement.src = targetUrl;
        this.currentSrc = targetUrl;
        this.audioElement.load();
        await this.audioElement.play();
        return true;
      } catch (retryError) {
        console.error('[FATAL AUDIO FAILURE]: Could not recover stream playback after re-initialization.', retryError);
        return false;
      }
    }
  }

  public pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  public seek(seconds: number) {
    if (this.audioElement && !isNaN(this.audioElement.duration)) {
      this.audioElement.currentTime = Math.max(0, Math.min(seconds, this.audioElement.duration));
    }
  }

  public setVolume(volume: number) {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

// Export a singleton instance for global player control
export const globalAudioPlayer = new BulletproofAudioPlayer();
