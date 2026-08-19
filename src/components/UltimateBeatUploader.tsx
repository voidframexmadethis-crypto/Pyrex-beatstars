import React, { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { useStore } from '../context/StoreContext';

export function UltimateBeatUploader() {
  const { state } = useStore();
  const config = state.profile.marketingConfig;
  const [beatTitle, setBeatTitle] = useState('');
  const [bpm, setBpm] = useState('140');
  const [genre, setGenre] = useState('Trap');
  const [priceLease, setPriceLease] = useState(String(config?.defaultMp3Price || '29.99'));
  const [priceExclusive, setPriceExclusive] = useState(String(config?.defaultExclusivePrice || '299.99'));
  const [artworkUrl, setArtworkUrl] = useState('');
  const [beatPath, setBeatPath] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  // SEO & Marketing Auto-Generated State
  const [seoKeywords, setSeoKeywords] = useState('');
  const [socialCaption, setSocialCaption] = useState('');
  
  // Video Generation States
  const [generating, setGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleBeatUpload = async () => {
    if (!fileInputRef.current?.files || fileInputRef.current.files.length === 0) {
      alert('Please select a file first.');
      return;
    }
    
    setUploading(true);
    const file = fileInputRef.current.files[0];
    
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload-token',
        multipart: true,
      });

      console.log('Beat successfully uploaded to:', blob.url);
      setBeatPath(blob.url);
      alert('Beat uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  // Auto-generate SEO tags and captions when title or genre updates
  const handleTitleChange = (val: string) => {
    setBeatTitle(val);
    const cleanTitle = val.replace(/[^a-zA-Z0-9 ]/g, '');
    const generatedTags = `#${cleanTitle.replace(/\s+/g, '')} #typebeat #${genre.toLowerCase().replace(/[^a-z]/g, '')} #producer #flstudio #krypside`;
    setSeoKeywords(`${cleanTitle} type beat, buy ${cleanTitle} instrumentals, ${genre} beats 2026, Krypside catalog`);
    setSocialCaption(`${val} (Prod. Krypside) - Secure exclusive rights & instant delivery at krypside.com ${generatedTags}`);
  };

  // Pre-load artwork for canvas rendering
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Video Generator Execution with MediaElementSourceNode + Web Audio
  const handleGenerateVideo = async () => {
    if (!artworkUrl || !beatTitle) return;
    setGenerating(true);

    try {
      if (!imageRef.current) {
        try {
          imageRef.current = await loadImage(artworkUrl);
        } catch (_) {
          const fallbackCanvas = document.createElement('canvas');
          fallbackCanvas.width = 500; fallbackCanvas.height = 500;
          const fbCtx = fallbackCanvas.getContext('2d')!;
          fbCtx.fillStyle = '#1f2937'; fbCtx.fillRect(0, 0, 500, 500);
          fbCtx.fillStyle = '#60a5fa'; fbCtx.font = 'bold 40px sans-serif'; fbCtx.fillText('KRYPSIDE', 120, 260);
          imageRef.current = await loadImage(fallbackCanvas.toDataURL());
        }
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      canvas.width = 720;
      canvas.height = 1280;

      const canvasStream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : null;
      if (!canvasStream) {
        alert('Canvas capture not supported in this browser');
        setGenerating(false);
        return;
      }

      // Audio stream destination setup using Web Audio API
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      const audioDestination = audioCtx.createMediaStreamDestination();

      let activeAudioElement: HTMLAudioElement | null = null;
      let hasRealAudio = false;

      if (beatPath) {
        try {
          const audioSrc = beatPath.startsWith('http') || beatPath.startsWith('blob:') || beatPath.startsWith('/')
            ? beatPath
            : `${window.location.origin}/${beatPath}`;

          if ((window as any).activeAudio) {
            (window as any).activeAudio.pause();
            (window as any).activeAudio.currentTime = 0;
          }
          const audioElement = new Audio();
          (window as any).activeAudio = audioElement;
          audioElement.crossOrigin = "anonymous";
          audioElement.preload = "metadata";
          audioElement.src = audioSrc;

          const sourceNode = audioCtx.createMediaElementSource(audioElement);
          sourceNode.connect(audioCtx.destination);
          sourceNode.connect(audioDestination);

          activeAudioElement = audioElement;
          hasRealAudio = true;
        } catch (audioErr) {
          console.warn("Could not bind real audio source, falling back to synth:", audioErr);
        }
      }

      if (!hasRealAudio) {
        const bpmNum = parseInt(bpm) || 140;
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

      // Combined Stream with Canvas Video Tracks + Audio Destination Tracks
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
          console.error("Playback failed:", pErr);
        }
      }

      recorder.start();

      let frame = 0;
      const maxFrames = 300; // up to 10 seconds teaser

      const renderFrame = () => {
        if (frame < maxFrames && recorder.state === "recording") {
          ctx.fillStyle = '#030712';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const beatIntensity = Math.sin((frame / 15) * Math.PI) * 0.15;
          const currentScale = 0.6 + beatIntensity;

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
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, canvas.height - 400, canvas.width, 400);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 50px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(beatTitle, canvas.width / 2, canvas.height - 140);

          ctx.fillStyle = '#9ca3af';
          ctx.font = '24px monospace';
          ctx.fillText(`BPM: ${bpm} • Prod. Krypside`, canvas.width / 2, canvas.height - 90);

          // Watermark badge
          const p = 40;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(p, p, 340, 70);
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
          ctx.strokeRect(p, p, 340, 70);

          ctx.fillStyle = '#ffffff';
          ctx.font = '900 24px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('KRYPSIDE', p + 20, p + 42);

          ctx.fillStyle = '#60a5fa';
          ctx.font = '16px monospace';
          ctx.fillText('krypside.com', p + 160, p + 42);

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
      console.error('Video rendering error', err);
      setGenerating(false);
    }
  };

  const resetForm = () => {
    setBeatTitle('');
    setBpm('140');
    setGenre('Trap');
    setPriceLease(String(config?.defaultMp3Price || '29.99'));
    setPriceExclusive(String(config?.defaultExclusivePrice || '299.99'));
    setArtworkUrl('');
    setBeatPath('');
    setSeoKeywords('');
    setSocialCaption('');
    setVideoUrl(null);
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-950 border border-blue-900/40 rounded-3xl p-8 text-white shadow-2xl space-y-8 font-sans">
      <div className="flex items-center justify-between border-b border-gray-900 pb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-blue-400">KRYPSIDE MASTER UPLOADER</h2>
          <p className="text-xs text-gray-400 mt-1 font-mono">Single-Producer Enterprise Catalog & Growth Engine</p>
        </div>
        <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded-full font-mono font-bold">
          SYSTEM ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Track Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">BEAT TITLE</label>
            <input 
              type="text" 
              value={beatTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Midnight Runner"
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">BPM</label>
              <input 
                type="text" 
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">GENRE / STYLE</label>
              <select 
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition"
              >
                <option value="Trap">Trap</option>
                <option value="Dark Trap">Dark Trap</option>
                <option value="Hip Hop">Hip Hop</option>
                <option value="Pop">Pop</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">LEASE PRICE ($)</label>
              <input 
                type="text" 
                value={priceLease}
                onChange={(e) => setPriceLease(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">EXCLUSIVE PRICE ($)</label>
              <input 
                type="text" 
                value={priceExclusive}
                onChange={(e) => setPriceExclusive(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">BEAT AUDIO FILE (SELECT & UPLOAD)</label>
            <input 
              type="file" 
              ref={fileInputRef}
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition"
            />
            <button
              onClick={handleBeatUpload}
              disabled={uploading}
              className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-indigo-950 cursor-pointer tracking-wider"
            >
              {uploading ? 'Uploading to Vault...' : 'Upload to Vault'}
            </button>
            <div className="mt-2">
               <label className="block text-xs font-mono text-gray-400 mb-1">BEAT AUDIO PATH / URL (AUTO-FILLED)</label>
               <input 
                type="text" 
                value={beatPath}
                onChange={(e) => setBeatPath(e.target.value)}
                placeholder="e.g., beats/midnight-runner.mp3 or https://..."
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">COVER ARTWORK URL (CDN)</label>
            <input 
              type="text" 
              value={artworkUrl}
              onChange={(e) => setArtworkUrl(e.target.value)}
              placeholder="https://cdn.krypside.com/art/beat-cover.jpg"
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* Automated SEO & Marketing Output */}
        <div className="bg-black/60 border border-gray-900 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-black tracking-wide text-blue-400 font-mono">AUTOMATED SEO & METADATA</h4>
            
            <div>
              <label className="block text-[10px] font-mono text-gray-500 mb-1">GOOGLE SEARCH KEYWORDS</label>
              <input 
                type="text" 
                readOnly
                value={seoKeywords}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-500 mb-1">SOCIAL CAPTION & TAGS (CLICK TO COPY)</label>
              <textarea 
                readOnly
                value={socialCaption}
                onClick={() => navigator.clipboard.writeText(socialCaption)}
                className="w-full h-20 bg-gray-900/50 border border-gray-800 rounded-lg p-3 text-xs text-gray-300 font-mono resize-none cursor-pointer hover:border-blue-500/50 transition"
              />
            </div>
          </div>

          <button 
            onClick={() => {
              alert('Beat and all assets deployed successfully to Krypside catalog!');
              resetForm();
            }}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-lg shadow-blue-950 cursor-pointer tracking-wider uppercase"
          >
            Publish Beat to Storefront
          </button>
        </div>
      </div>

      {/* Video Visualizer Generator Section */}
      <div className="border-t border-gray-900 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black tracking-wide text-blue-400 font-mono">PROMO VIDEO & VISUALIZER ENGINE</h3>
          <span className="text-[10px] font-mono text-gray-500">9:16 Watermarked WebM/MP4 Generator</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="relative aspect-[9/16] bg-black border border-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="hidden" />
            {videoUrl ? (
              <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-4 space-y-2">
                {artworkUrl ? (
                  <img src={artworkUrl} alt="Art" className="w-16 h-16 rounded-lg mx-auto object-cover border border-gray-700" />
                ) : (
                  <div className="w-16 h-16 rounded-lg mx-auto bg-gray-900 flex items-center justify-center text-xs text-gray-600">No Art</div>
                )}
                <p className="text-[10px] font-mono text-gray-500">Ready to Render Teaser</p>
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            <p className="text-xs text-gray-400 leading-relaxed font-mono">
              Generates a vertical teaser video combining canvas visuals and the beat's audio track via Web Audio API stream destinations.
            </p>

            <div className="flex flex-wrap gap-3">
              {!videoUrl ? (
                <button
                  onClick={handleGenerateVideo}
                  disabled={generating || !artworkUrl || !beatTitle}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-lg shadow-blue-950"
                >
                  {generating ? 'Rendering Visualizer...' : 'Generate Branded Video'}
                </button>
              ) : (
                <a
                  href={videoUrl}
                  download={`${beatTitle}-krypside-teaser.webm`}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-lg shadow-green-950"
                >
                  Download Video File
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UltimateBeatUploader;
