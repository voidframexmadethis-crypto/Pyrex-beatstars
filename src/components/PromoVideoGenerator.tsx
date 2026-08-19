import React, { useState, useRef } from 'react';

interface VideoGenProps {
  beatTitle: string;
  artworkUrl: string;
  audioUrl?: string;
  beatPath?: string;
}

export function PromoVideoGenerator({ beatTitle, artworkUrl, audioUrl, beatPath }: VideoGenProps) {
  const [generating, setGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pre-load image function
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const handleGenerateVideo = async () => {
    setGenerating(true);

    try {
      // 1. Load Artwork first
      if (!imageRef.current && artworkUrl) {
        try {
          imageRef.current = await loadImage(artworkUrl);
        } catch (e) {
          console.error("Failed to load artwork, using fallback", e);
        }
      }

      if (!imageRef.current) {
        // Fallback canvas image if artwork fails or missing
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = 500; fallbackCanvas.height = 500;
        const fbCtx = fallbackCanvas.getContext('2d')!;
        fbCtx.fillStyle = '#1f2937'; fbCtx.fillRect(0, 0, 500, 500);
        fbCtx.fillStyle = '#60a5fa'; fbCtx.font = 'bold 40px sans-serif'; fbCtx.fillText('KRYPSIDE', 120, 260);
        imageRef.current = await loadImage(fallbackCanvas.toDataURL());
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      // Set vertical 9:16 resolution (HD)
      canvas.width = 720;
      canvas.height = 1280;

      const canvasStream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : null;
      if (!canvasStream) {
        alert('Canvas video capture is not supported in this browser.');
        setGenerating(false);
        return;
      }

      // Audio stream destination setup using Web Audio API
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      const audioDestination = audioCtx.createMediaStreamDestination();

      const rawAudioPath = audioUrl || beatPath || '';
      let targetAudioSrc = '';
      if (rawAudioPath) {
        targetAudioSrc = rawAudioPath.startsWith('http') || rawAudioPath.startsWith('blob:') || rawAudioPath.startsWith('/')
          ? rawAudioPath
          : `${window.location.origin}/${rawAudioPath}`;
      }

      let activeAudioElement: HTMLAudioElement | null = null;
      let hasRealAudio = false;

      if (targetAudioSrc) {
        try {
          if ((window as any).activeAudio) {
            (window as any).activeAudio.pause();
            (window as any).activeAudio.currentTime = 0;
          }
          const audioElement = new Audio();
          (window as any).activeAudio = audioElement;
          audioElement.crossOrigin = "anonymous";
          audioElement.preload = "metadata";
          audioElement.src = targetAudioSrc;
          audioRef.current = audioElement;

          const sourceNode = audioCtx.createMediaElementSource(audioElement);
          sourceNode.connect(audioCtx.destination);
          sourceNode.connect(audioDestination);
          
          activeAudioElement = audioElement;
          hasRealAudio = true;
        } catch (audioErr) {
          console.warn("Failed to attach media element source, falling back to synth audio:", audioErr);
        }
      }

      if (!hasRealAudio) {
        // Fallback Rhythmic Audio Synthesis connected to audioDestination
        const bpmNum = 140;
        const beatIntervalSec = 60 / bpmNum;
        for (let b = 0; b < 20; b++) {
          const beatTime = audioCtx.currentTime + b * beatIntervalSec;
          if (beatTime > audioCtx.currentTime + 10) break;

          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(130, beatTime);
          osc.frequency.exponentialRampToValueAtTime(30, beatTime + 0.15);

          gain.gain.setValueAtTime(0.8, beatTime);
          gain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.15);

          osc.connect(gain);
          gain.connect(audioDestination);

          osc.start(beatTime);
          osc.stop(beatTime + 0.15);

          if (b % 2 === 1) {
            const hatOsc = audioCtx.createOscillator();
            const hatGain = audioCtx.createGain();
            hatOsc.type = 'triangle';
            hatOsc.frequency.setValueAtTime(800, beatTime);
            hatGain.gain.setValueAtTime(0.3, beatTime);
            hatGain.gain.exponentialRampToValueAtTime(0.01, beatTime + 0.08);

            hatOsc.connect(hatGain);
            hatGain.connect(audioDestination);

            hatOsc.start(beatTime);
            hatOsc.stop(beatTime + 0.08);
          }
        }
      }

      // Combine Canvas Video Tracks & Web Audio Tracks
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks()
      ]);

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(combinedStream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setGenerating(false);
        if (activeAudioElement) {
          try {
            activeAudioElement.pause();
            activeAudioElement.currentTime = 0;
          } catch (_) {}
        }
        try { audioCtx.close(); } catch (_) {}
      };

      if (activeAudioElement) {
        activeAudioElement.onended = () => {
          if (recorder.state === "recording") {
            recorder.stop();
          }
        };
        try {
          await activeAudioElement.play();
        } catch (pErr) {
          console.error("Playback error:", pErr);
        }
      }

      recorder.start();

      // Render Loop with Beat Reactivity
      let frame = 0;
      // Record up to 10 seconds teaser (300 frames at 30fps)
      const maxFrames = 300;

      const renderFrame = () => {
        if (frame < maxFrames && recorder.state === "recording") {
          ctx.fillStyle = '#030712';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const beatIntensity = Math.sin((frame / 15) * Math.PI) * 0.15;
          const baseScale = 0.6;
          const currentScale = baseScale + beatIntensity;

          const img = imageRef.current!;
          const aspect = img.width / img.height;
          const drawWidth = canvas.width * currentScale;
          const drawHeight = drawWidth / aspect;
          const x = (canvas.width - drawWidth) / 2;
          const y = (canvas.height - drawHeight) / 2;

          ctx.shadowBlur = 30 + (beatIntensity * 100);
          ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
          
          ctx.drawImage(img, x, y, drawWidth, drawHeight);
          ctx.shadowBlur = 0;

          const gradient = ctx.createLinearGradient(0, canvas.height - 400, 0, canvas.height);
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, canvas.height - 400, canvas.width, 400);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 52px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(beatTitle, canvas.width / 2, canvas.height - 140);

          ctx.fillStyle = '#9ca3af';
          ctx.font = '26px JetBrains Mono, monospace';
          ctx.fillText('Prod. by Krypside', canvas.width / 2, canvas.height - 90);

          const p = 40;
          const wW = 340;
          const wH = 80;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          
          ctx.beginPath();
          ctx.moveTo(p + 15, p);
          ctx.lineTo(p + wW - 15, p);
          ctx.quadraticCurveTo(p + wW, p, p + wW, p + 15);
          ctx.lineTo(p + wW, p + wH - 15);
          ctx.quadraticCurveTo(p + wW, p + wH, p + wW - 15, p + wH);
          ctx.lineTo(p + 15, p + wH);
          ctx.quadraticCurveTo(p, p + wH, p, p + wH - 15);
          ctx.lineTo(p, p + 15);
          ctx.quadraticCurveTo(p, p, p + 15, p);
          ctx.closePath();
          ctx.fill();
          
          ctx.fillStyle = '#ffffff';
          ctx.font = '900 28px Inter, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('KRYPSIDE', p + 25, p + 52);

          ctx.fillStyle = '#60a5fa';
          ctx.font = '20px JetBrains Mono, monospace';
          ctx.fillText('krypside.com', p + 170, p + 52);

          frame++;
          requestAnimationFrame(renderFrame);
        } else {
          if (recorder.state === "recording") {
            recorder.stop();
          }
          imageRef.current = null;
        }
      };

      renderFrame();
    } catch (err) {
      console.error('Video generation failed', err);
      setGenerating(false);
    }
  };

  const presetTags = `#${beatTitle.replace(/\s+/g, '')} #typebeat #producer #flstudio #trapbeats #artworkviz`;

  return (
    <div className="bg-gray-950 border border-blue-900/40 rounded-2xl p-6 text-white shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-black tracking-wide text-blue-400">ARTWORK VISUALIZER ENGINE</h4>
          <p className="text-xs text-gray-400 mt-1">Generates 9:16 video synced with canvas visuals & beat audio stream.</p>
        </div>
        <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-mono">
          AUDIO & VIDEO RECORDING
        </span>
      </div>

      <div className="bg-black border border-gray-900 rounded-xl p-5 space-y-4">
        <canvas ref={canvasRef} className="hidden" />

        <div className="relative w-full aspect-[9/16] max-h-96 bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center overflow-hidden mx-auto">
          {videoUrl ? (
            <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
          ) : (
            <div className="text-center space-y-3 p-6">
              {artworkUrl ? (
                <img src={artworkUrl} alt="Preview" className="w-20 h-20 rounded-lg mx-auto object-cover shadow-xl border-2 border-gray-700" />
              ) : (
                 <div className="w-20 h-20 rounded-lg mx-auto bg-gray-800 flex items-center justify-center text-gray-600">No Art</div>
              )}
              <div className='space-y-1'>
                <span className="text-xs font-mono text-gray-500">READY TO VISUALIZE</span>
                <h5 className="font-bold text-sm text-gray-300">{beatTitle}</h5>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
          <p className="text-xs text-gray-400 font-mono w-full truncate">
            {videoUrl ? 'Render complete with audio.' : `Audio Source: ${audioUrl || beatPath ? 'Attached' : 'Synthesized'}`}
          </p>

          {!videoUrl ? (
            <button
              onClick={handleGenerateVideo}
              disabled={generating || !artworkUrl}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-lg shadow-blue-950 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <span className="animate-spin text-xs">⏳</span>
                  <span>Recording Teaser Video...</span>
                </>
              ) : (
                <span>Generate Visualizer Video</span>
              )}
            </button>
          ) : (
            <a
              href={videoUrl}
              download={`${beatTitle}-krypside-visualizer.webm`}
              className="w-full md:w-auto text-center bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-lg shadow-green-950"
            >
              Download Visualizer
            </a>
          )}
        </div>

        {videoUrl && (
          <div className="pt-3 border-t border-gray-900 space-y-2">
            <label className="block text-[10px] font-mono text-gray-400">OPTIMIZED CAPTION & HASHTAGS (CLICK TO COPY)</label>
            <div 
              onClick={() => navigator.clipboard.writeText(`${beatTitle} (Visualizer) - Get this beat at krypside.com ${presetTags}`)}
              className="bg-gray-900/80 border border-gray-800 p-3 rounded-lg text-xs font-mono text-gray-300 cursor-pointer hover:border-blue-500/50 transition truncate"
            >
              {beatTitle} (Visualizer) - Get this beat at krypside.com {presetTags}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
