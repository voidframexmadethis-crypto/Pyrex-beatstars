import { createMasterAudioChain } from './audioMastering';

// 🎵 REAL-TIME WEB AUDIO SYNTHESIZER & 808 ENGINE
// Guarantees crystal clear, punchy low-end playback with master limiter and soft clipping ceiling.

class WebAudioBeatEngine {
  private ctx: AudioContext | null = null;
  private masterBus: GainNode | null = null;
  private isPlaying = false;
  private intervalId: any = null;
  private step = 0;
  private currentBpm = 130;

  public start(bpm: number = 130) {
    this.stop();
    this.currentBpm = bpm > 0 ? bpm : 130;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // Create master bus and wire up mastering chain (high-pass, low compressor, limiter, soft clipper)
      this.masterBus = this.ctx.createGain();
      this.masterBus.gain.value = 0.9;
      createMasterAudioChain(this.ctx, this.masterBus);

      this.isPlaying = true;
      this.step = 0;

      const tempoMs = (60 / this.currentBpm / 4) * 1000; // 16th notes
      this.intervalId = setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.playStep(this.step % 16);
        this.step++;
      }, tempoMs);
    } catch (e) {
      console.error('Failed to initialize Web Audio Engine:', e);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
      this.masterBus = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private playStep(s: number) {
    if (!this.ctx || !this.masterBus) return;
    const now = this.ctx.currentTime;

    // Kick Drum (0, 8, 10, 14) - Clean punchy sub kick
    if (s === 0 || s === 8 || s === 10 || s === 14) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.22);
      gain.gain.setValueAtTime(0.40, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.masterBus);
      osc.start(now);
      osc.stop(now + 0.22);
    }

    // Snare / Clap (4, 12) - Crisp studio snare
    if (s === 4 || s === 12) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
      gain.gain.setValueAtTime(0.30, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.masterBus);
      osc.start(now);
      osc.stop(now + 0.15);
    }

    // Hi-Hat - Crisp top end
    if (s % 2 === 0 || s === 15) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(6500 + (s % 4 === 2 ? 800 : 0), now);
      const hatDecay = s === 14 ? 0.08 : 0.03;
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + hatDecay);
      osc.connect(gain);
      gain.connect(this.masterBus);
      osc.start(now);
      osc.stop(now + hatDecay);
    }

    // 808 Bass Synth - Warm sub bass without clipping
    if (s === 0 || s === 3 || s === 6 || s === 10 || s === 12) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const freqs = [55, 61.74, 65.41, 49, 55]; // A1, B1, C2, G1, A1
      const freq = freqs[s % freqs.length];
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.30, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.connect(gain);
      gain.connect(this.masterBus);
      osc.start(now);
      osc.stop(now + 0.32);
    }
  }
}

export const globalSynthBeatEngine = new WebAudioBeatEngine();
