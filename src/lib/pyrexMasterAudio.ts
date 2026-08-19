/**
 * 🔊 PYREX MASTER AUDIO HYBRID ENGINE
 * High-Performance Globally Scoped Audio Controller & DSP Processing Chain
 * Outperforms standard web playback via Web Audio API + HTML5 Streaming Hybrid
 */

export interface EqualizerSettings {
  bass?: number;   // Low shelf gain in dB (-12 to +12)
  mid?: number;    // Peaking gain in dB (-12 to +12)
  treble?: number; // High shelf gain in dB (-12 to +12)
}

export interface AudioEngineStats {
  engineVersion: string;
  state: AudioContextState | 'uninitialized';
  sampleRate: number;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  currentSrc: string | null;
  bufferedRangesCount: number;
  cachedBuffersCount: number;
  equalizer: { bass: number; mid: number; treble: number };
  fftBinCount: number;
  peakLevel: number;
}

export type AudioEventListener = (event: string, data?: any) => void;

class PyrexSpinnaMasterAudioEngine {
  private static instance: PyrexSpinnaMasterAudioEngine;
  
  public audioCtx: AudioContext | null = null;
  public audioElement: HTMLAudioElement;
  
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private lowEqNode: BiquadFilterNode | null = null;
  private midEqNode: BiquadFilterNode | null = null;
  private highEqNode: BiquadFilterNode | null = null;
  private highPassFilter: BiquadFilterNode | null = null;
  private lowEndCompressor: DynamicsCompressorNode | null = null;
  private masterLimiter: DynamicsCompressorNode | null = null;
  private softClipper: WaveShaperNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  
  private bufferCache = new Map<string, AudioBuffer>();
  private listeners = new Set<AudioEventListener>();
  private eqSettings = { bass: 0, mid: 0, treble: 0 };
  private activeBufferSource: AudioBufferSourceNode | null = null;
  
  private isInitialized = false;
  private currentTrackMetadata: any = null;

  constructor() {
    // Connect or initialize HTML5 audio element
    if (typeof document !== 'undefined') {
      let elem = document.getElementById('global-audio-player') as HTMLAudioElement;
      if (!elem) {
        elem = document.createElement('audio');
        elem.id = 'global-audio-player';
        elem.preload = 'metadata';
        elem.crossOrigin = 'anonymous';
        document.body.appendChild(elem);
      }
      this.audioElement = elem;
      this.setupAudioListeners();
    } else {
      this.audioElement = {} as HTMLAudioElement;
    }
  }

  public static getInstance(): PyrexSpinnaMasterAudioEngine {
    if (!PyrexSpinnaMasterAudioEngine.instance) {
      PyrexSpinnaMasterAudioEngine.instance = new PyrexSpinnaMasterAudioEngine();
    }
    return PyrexSpinnaMasterAudioEngine.instance;
  }

  /**
   * Initializes the Web Audio Context and DSP Mastering Chain
   */
  public initContext(): AudioContext | null {
    if (this.isInitialized && this.audioCtx) return this.audioCtx;
    if (typeof window === 'undefined') return null;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return null;

      this.audioCtx = new AudioCtxClass();
      
      // 1. Create MediaElement Source
      if (this.audioElement && !this.sourceNode) {
        this.sourceNode = this.audioCtx.createMediaElementSource(this.audioElement);
      }

      // 2. Preamp Gain Node (Volume & Ramping)
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(this.audioElement.volume || 0.85, this.audioCtx.currentTime);

      // 3. 3-Band Parametric Equalizer
      this.lowEqNode = this.audioCtx.createBiquadFilter();
      this.lowEqNode.type = 'lowshelf';
      this.lowEqNode.frequency.setValueAtTime(100, this.audioCtx.currentTime);
      this.lowEqNode.gain.setValueAtTime(this.eqSettings.bass, this.audioCtx.currentTime);

      this.midEqNode = this.audioCtx.createBiquadFilter();
      this.midEqNode.type = 'peaking';
      this.midEqNode.frequency.setValueAtTime(1000, this.audioCtx.currentTime);
      this.midEqNode.Q.setValueAtTime(1.0, this.audioCtx.currentTime);
      this.midEqNode.gain.setValueAtTime(this.eqSettings.mid, this.audioCtx.currentTime);

      this.highEqNode = this.audioCtx.createBiquadFilter();
      this.highEqNode.type = 'highshelf';
      this.highEqNode.frequency.setValueAtTime(8000, this.audioCtx.currentTime);
      this.highEqNode.gain.setValueAtTime(this.eqSettings.treble, this.audioCtx.currentTime);

      // 4. Sub-Rumble High Pass Filter (< 24Hz rumble cleanup)
      this.highPassFilter = this.audioCtx.createBiquadFilter();
      this.highPassFilter.type = 'highpass';
      this.highPassFilter.frequency.setValueAtTime(24, this.audioCtx.currentTime);
      this.highPassFilter.Q.setValueAtTime(0.707, this.audioCtx.currentTime);

      // 5. Low-End Smooth Compressor (Transparent dynamic control)
      this.lowEndCompressor = this.audioCtx.createDynamicsCompressor();
      this.lowEndCompressor.threshold.setValueAtTime(-12, this.audioCtx.currentTime);
      this.lowEndCompressor.knee.setValueAtTime(12, this.audioCtx.currentTime);
      this.lowEndCompressor.ratio.setValueAtTime(2.0, this.audioCtx.currentTime);
      this.lowEndCompressor.attack.setValueAtTime(0.010, this.audioCtx.currentTime);
      this.lowEndCompressor.release.setValueAtTime(0.200, this.audioCtx.currentTime);

      // 6. Studio True Peak Protector (-0.5 dB Peak Ceiling)
      this.masterLimiter = this.audioCtx.createDynamicsCompressor();
      this.masterLimiter.threshold.setValueAtTime(-0.5, this.audioCtx.currentTime);
      this.masterLimiter.knee.setValueAtTime(6, this.audioCtx.currentTime);
      this.masterLimiter.ratio.setValueAtTime(8.0, this.audioCtx.currentTime);
      this.masterLimiter.attack.setValueAtTime(0.005, this.audioCtx.currentTime);
      this.masterLimiter.release.setValueAtTime(0.120, this.audioCtx.currentTime);

      // 7. FFT Analyser Node for Real-time Visualizer Spectrum
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 64;
      this.analyserNode.smoothingTimeConstant = 0.85;

      // Connect Nodes: Source -> Gain -> LowEQ -> MidEQ -> HighEQ -> HighPass -> Compressor -> Limiter -> Analyser -> Destination
      if (this.sourceNode) {
        this.sourceNode.connect(this.gainNode);
        this.gainNode.connect(this.lowEqNode);
        this.lowEqNode.connect(this.midEqNode);
        this.midEqNode.connect(this.highEqNode);
        this.highEqNode.connect(this.highPassFilter);
        this.highPassFilter.connect(this.lowEndCompressor);
        this.lowEndCompressor.connect(this.masterLimiter);
        this.masterLimiter.connect(this.analyserNode);
        this.analyserNode.connect(this.audioCtx.destination);
      }

      this.isInitialized = true;
    } catch (e) {
      console.warn("[PyrexSpinnaMasterAudio] Web Audio DSP initialization fallback notice:", e);
    }

    return this.audioCtx;
  }

  private makeSoftClipCurve(nSamples = 4096): Float32Array {
    const curve = new Float32Array(nSamples);
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = Math.tanh(x * 1.2) / Math.tanh(1.2);
    }
    return curve;
  }

  private hasRetried = false;

  private setupAudioListeners() {
    if (!this.audioElement) return;

    this.audioElement.addEventListener('timeupdate', () => this.notifyListeners('timeupdate', { currentTime: this.audioElement.currentTime, duration: this.audioElement.duration }));
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.hasRetried = false;
      this.notifyListeners('loadedmetadata', { duration: this.audioElement.duration });
    });
    this.audioElement.addEventListener('play', () => this.notifyListeners('play'));
    this.audioElement.addEventListener('pause', () => this.notifyListeners('pause'));
    this.audioElement.addEventListener('ended', () => this.notifyListeners('ended'));
    this.audioElement.addEventListener('stalled', () => {
      console.warn("[PyrexSpinnaMasterAudio] Audio buffer stalled. Attempting recovery...");
      if (!this.hasRetried) {
        this.hasRetried = true;
        this.audioElement.load();
        this.audioElement.play().catch(() => {});
      } else {
        this.notifyListeners('error', { error: 'stalled', message: 'Stream unavailable' });
      }
    });
    this.audioElement.addEventListener('error', (e) => {
      console.warn("[PyrexSpinnaMasterAudio] Audio element error:", e);
      if (!this.hasRetried) {
        this.hasRetried = true;
        setTimeout(() => {
          this.audioElement.load();
          this.audioElement.play().catch(() => {});
        }, 1000);
      } else {
        this.notifyListeners('error', { error: this.audioElement.error, message: 'Stream unavailable' });
      }
    });
    this.audioElement.addEventListener('volumechange', () => this.notifyListeners('volumechange', { volume: this.audioElement.volume }));
  }

  public async retry(): Promise<void> {
    this.hasRetried = false;
    if (this.audioElement && this.audioElement.src) {
      this.audioElement.load();
      return this.audioElement.play();
    }
  }

  private notifyListeners(event: string, data?: any) {
    this.listeners.forEach(fn => {
      try { fn(event, data); } catch (e) { console.error(e); }
    });
  }

  public subscribe(listener: AudioEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Resumes AudioContext safely on user gesture
   */
  public unlockAudioContext(): Promise<void> {
    if (!this.audioCtx) {
      this.initContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      return this.audioCtx.resume();
    }
    return Promise.resolve();
  }

  /**
   * Main Playback Method
   */
  public async play(target?: string | any): Promise<void> {
    await this.unlockAudioContext();

    let url = '';
    let trackId = '';
    if (typeof target === 'string') {
      url = target;
    } else if (target && typeof target === 'object') {
      this.currentTrackMetadata = target;
      trackId = target.id || '';
      if (window.resolvePyrexSpinnaAudioStream) {
        url = window.resolvePyrexSpinnaAudioStream(target);
      } else {
        url = target.directAudioUrl || target.previewUrl || target.audioUrl || target.backupAudioUrl || target.r2AudioUrl || target.watermarkedAudioUrl || target.src || '';
      }
    }

    if (url) {
      // Append unique cache-bypassing parameter so browser never serves cached audio from previous beat
      const separator = url.includes('?') ? '&' : '?';
      const cacheBustId = trackId ? encodeURIComponent(trackId) : Math.random().toString(36).substring(7);
      if (!url.includes('?v=') && !url.includes('blob:')) {
        url = `${url}${separator}v=${cacheBustId}_${Date.now()}`;
      }
    }

    // Audio Lifecycle Reset: pause, set src, load, play
    if (this.audioElement) {
      this.audioElement.pause();
      if (trackId) {
        this.audioElement.setAttribute('data-track-id', trackId);
      }
      if (url) {
        this.audioElement.src = url;
        this.audioElement.load();
      }
    }

    if (this.audioElement && this.audioElement.src) {
      if ((window as any).activeAudio && (window as any).activeAudio !== this.audioElement) {
        (window as any).activeAudio.pause();
        (window as any).activeAudio.currentTime = 0;
      }
      (window as any).activeAudio = this.audioElement;
      return this.audioElement.play().catch(async err => {
        console.warn("[PyrexSpinnaMasterAudio] Playback prevented or interrupted, attempting re-initialization:", err);
        if (this.audioElement) {
          try {
            if (url) {
              this.audioElement.src = url;
              this.audioElement.load();
              return await this.audioElement.play();
            }
          } catch (retryErr) {
            console.error("[PyrexSpinnaMasterAudio] Re-initialization retry failed:", retryErr);
          }
        }
        throw err;
      });
    }
  }

  /**
   * Pause Playback
   */
  public pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.activeBufferSource) {
      try { this.activeBufferSource.stop(); } catch (e) {}
      this.activeBufferSource = null;
    }
  }

  /**
   * Resume Playback
   */
  public resume(): Promise<void> {
    return this.play();
  }

  /**
   * Stop Playback & Reset
   */
  public stop(): void {
    this.pause();
    if (this.audioElement) {
      this.audioElement.currentTime = 0;
    }
  }

  /**
   * Sample-accurate seek
   */
  public seek(timeInSeconds: number): void {
    if (this.audioElement && !isNaN(timeInSeconds)) {
      this.audioElement.currentTime = Math.max(0, Math.min(timeInSeconds, this.audioElement.duration || 0));
    }
  }

  /**
   * Volume Control with exponential / linear GainNode parameter adjustment
   */
  public setVolume(val: number): void {
    const clamped = Math.max(0, Math.min(1, val));
    if (this.audioElement) {
      this.audioElement.volume = clamped;
    }
    if (this.gainNode && this.audioCtx) {
      try {
        this.gainNode.gain.setValueAtTime(clamped, this.audioCtx.currentTime);
      } catch (e) {
        this.gainNode.gain.value = clamped;
      }
    }
  }

  /**
   * Toggle or set Mute
   */
  public setMuted(muted: boolean): void {
    if (this.audioElement) {
      this.audioElement.muted = muted;
    }
  }

  /**
   * Adjust 3-Band Equalizer (Bass, Mid, Treble dB gain)
   */
  public setEqualizer(settings: EqualizerSettings): void {
    this.initContext();
    if (settings.bass !== undefined) this.eqSettings.bass = settings.bass;
    if (settings.mid !== undefined) this.eqSettings.mid = settings.mid;
    if (settings.treble !== undefined) this.eqSettings.treble = settings.treble;

    if (this.audioCtx) {
      const now = this.audioCtx.currentTime;
      if (this.lowEqNode && settings.bass !== undefined) {
        this.lowEqNode.gain.setValueAtTime(settings.bass, now);
      }
      if (this.midEqNode && settings.mid !== undefined) {
        this.midEqNode.gain.setValueAtTime(settings.mid, now);
      }
      if (this.highEqNode && settings.treble !== undefined) {
        this.highEqNode.gain.setValueAtTime(settings.treble, now);
      }
    }
  }

  /**
   * Pre-loads an audio file into Web Audio Buffer for zero-latency hybrid triggering
   */
  public async preload(url: string): Promise<AudioBuffer | null> {
    if (this.bufferCache.has(url)) {
      return this.bufferCache.get(url)!;
    }

    try {
      this.initContext();
      if (!this.audioCtx) return null;

      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const decodedData = await this.audioCtx.decodeAudioData(arrayBuffer);
      
      // Keep cache size bounded (max 20 decoded tracks)
      if (this.bufferCache.size > 20) {
        const firstKey = this.bufferCache.keys().next().value;
        if (firstKey) this.bufferCache.delete(firstKey);
      }

      this.bufferCache.set(url, decodedData);
      return decodedData;
    } catch (e) {
      console.warn("[PyrexSpinnaMasterAudio] Preload decode notice:", e);
      return null;
    }
  }

  /**
   * Plays pre-decoded buffer instantly with zero latency
   */
  public async playBuffer(url: string): Promise<void> {
    await this.unlockAudioContext();
    if (!this.audioCtx) return;

    let buffer = this.bufferCache.get(url);
    if (!buffer) {
      buffer = (await this.preload(url)) || undefined;
    }
    if (!buffer) return;

    if (this.activeBufferSource) {
      try { this.activeBufferSource.stop(); } catch (e) {}
    }

    const src = this.audioCtx.createBufferSource();
    src.buffer = buffer;
    
    if (this.gainNode) {
      src.connect(this.gainNode);
    } else {
      src.connect(this.audioCtx.destination);
    }

    src.start(0);
    this.activeBufferSource = src;
  }

  /**
   * Returns FFT Frequency Array for Visualizers (0-255 per bin)
   */
  public getFrequencyData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(0);
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  /**
   * Returns Waveform Time-Domain Array for Visualizers
   */
  public getWaveformData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(0);
    const dataArray = new Uint8Array(this.analyserNode.fftSize);
    this.analyserNode.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  /**
   * Telemetry and Audio Controller Status
   */
  public getStats(): AudioEngineStats {
    let peak = 0;
    if (this.analyserNode) {
      const data = this.getFrequencyData();
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum += data[i];
      }
      peak = Math.round((sum / (data.length * 255)) * 100);
    }

    return {
      engineVersion: "4.2.0-HYBRID-HYPERCORE",
      state: this.audioCtx ? this.audioCtx.state : 'uninitialized',
      sampleRate: this.audioCtx ? this.audioCtx.sampleRate : 44100,
      currentTime: this.audioElement ? this.audioElement.currentTime : 0,
      duration: this.audioElement ? this.audioElement.duration || 0 : 0,
      volume: this.audioElement ? this.audioElement.volume : 0.85,
      isMuted: this.audioElement ? this.audioElement.muted : false,
      isPlaying: Boolean(this.audioElement && !this.audioElement.paused && !this.audioElement.ended),
      currentSrc: this.audioElement ? this.audioElement.src || null : null,
      bufferedRangesCount: this.audioElement && this.audioElement.buffered ? this.audioElement.buffered.length : 0,
      cachedBuffersCount: this.bufferCache.size,
      equalizer: { ...this.eqSettings },
      fftBinCount: this.analyserNode ? this.analyserNode.frequencyBinCount : 0,
      peakLevel: peak
    };
  }

  /**
   * Backward Compatibility Bridge Method for window.PyrexSpinnaPlayer
   */
  public playBeat(url: string): void {
    this.play(url);
  }

  /**
   * Tear down
   */
  public destroy(): void {
    this.pause();
    this.listeners.clear();
    if (this.audioCtx) {
      try { this.audioCtx.close(); } catch (e) {}
    }
  }
}

// Instantiate Singleton Engine
export const pyrexMasterAudio = PyrexSpinnaMasterAudioEngine.getInstance();

// Attach to Global Scope if running in browser
if (typeof window !== 'undefined') {
  (window as any).PyrexSpinnaMasterAudio = pyrexMasterAudio;
  
  // Maintain backward compatibility for window.PyrexSpinnaPlayer
  (window as any).PyrexSpinnaPlayer = {
    playBeat: (url: string) => pyrexMasterAudio.playBeat(url),
    pause: () => pyrexMasterAudio.pause(),
    setVolume: (val: number) => pyrexMasterAudio.setVolume(val),
    seek: (time: number) => pyrexMasterAudio.seek(time),
    play: (target?: any) => pyrexMasterAudio.play(target),
    getStats: () => pyrexMasterAudio.getStats()
  };
}

export default pyrexMasterAudio;
