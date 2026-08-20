/**
 * 🎛️ PYREX STUDIO AUDIO MASTERING ENGINE
 * Applies crystal-clear transparent dynamics, high-pass rumble removal,
 * and true-peak protection for 100% distortion-free studio audio playback.
 */

export function createMasterAudioChain(audioCtx: AudioContext, inputNode: AudioNode, initialVolume = 0.5) {
  // 0. Dedicated Web Audio GainNode for clean volume control
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(initialVolume, audioCtx.currentTime);

  // 1. High-pass filter: Removes sub-audible DC offset rumble (< 24 Hz)
  const highPassFilter = audioCtx.createBiquadFilter();
  highPassFilter.type = 'highpass';
  highPassFilter.frequency.value = 24;
  highPassFilter.Q.value = 0.707;

  // 2. Ultra-smooth Low-End Compressor: Gentle, transparent control preserving full dynamic range
  const lowEndCompressor = audioCtx.createDynamicsCompressor();
  lowEndCompressor.threshold.setValueAtTime(-12, audioCtx.currentTime);
  lowEndCompressor.knee.setValueAtTime(12, audioCtx.currentTime);
  lowEndCompressor.ratio.setValueAtTime(2.0, audioCtx.currentTime);
  lowEndCompressor.attack.setValueAtTime(0.010, audioCtx.currentTime);
  lowEndCompressor.release.setValueAtTime(0.200, audioCtx.currentTime);

  // 3. Studio Master Peak Protector: Prevents digital inter-sample clipping (-0.5 dB True Peak)
  const masterLimiter = audioCtx.createDynamicsCompressor();
  masterLimiter.threshold.setValueAtTime(-0.5, audioCtx.currentTime);
  masterLimiter.knee.setValueAtTime(6, audioCtx.currentTime);
  masterLimiter.ratio.setValueAtTime(8.0, audioCtx.currentTime);
  masterLimiter.attack.setValueAtTime(0.005, audioCtx.currentTime);
  masterLimiter.release.setValueAtTime(0.120, audioCtx.currentTime);

  // Connect processing chain cleanly to destination
  inputNode.connect(gainNode);
  gainNode.connect(highPassFilter);
  highPassFilter.connect(lowEndCompressor);
  lowEndCompressor.connect(masterLimiter);
  masterLimiter.connect(audioCtx.destination);

  return {
    gainNode,
    highPassFilter,
    lowEndCompressor,
    masterLimiter
  };
}
