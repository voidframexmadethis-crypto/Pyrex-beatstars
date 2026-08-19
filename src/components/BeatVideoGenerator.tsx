import React, { useState, useRef, useEffect } from 'react';
import { Video, Download, Sparkles, Play, Pause, Disc, Music } from 'lucide-react';

interface BeatVideoGeneratorProps {
  beatTitle?: string;
  artist?: string;
  bpm?: number;
  musicalKey?: string;
  artworkUrl?: string;
  audioUrl?: string;
}

export default function BeatVideoGenerator({
  beatTitle = 'Trap Instrumental #1',
  artist = 'Pyrex Spinna',
  bpm = 140,
  musicalKey = 'G# Minor',
  artworkUrl = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  audioUrl = ''
}: BeatVideoGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoDownloadUrl, setVideoDownloadUrl] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Live preview animation loop
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 360;
    canvas.height = 640;

    let startTime = Date.now();
    let imgObj = new Image();
    imgObj.crossOrigin = 'anonymous';
    imgObj.src = artworkUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80';

    const renderPreview = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Background ambient gradient
      const grad = ctx.createRadialGradient(180, 320, 20, 180, 320, 300);
      grad.addColorStop(0, 'rgba(147, 51, 234, 0.25)');
      grad.addColorStop(1, 'rgba(10, 10, 12, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pulsing Artwork Card
      const pulse = Math.sin(elapsed * 4) * 6;
      const size = 240 + pulse;
      const x = (canvas.width - size) / 2;
      const y = 140;

      ctx.save();
      ctx.shadowColor = 'rgba(168, 85, 247, 0.5)';
      ctx.shadowBlur = 25;
      ctx.fillStyle = '#18181b';
      ctx.fillRect(x - 4, y - 4, size + 8, size + 8);
      ctx.restore();

      try {
        if (imgObj.complete) {
          ctx.drawImage(imgObj, x, y, size, size);
        }
      } catch (e) {
        ctx.fillStyle = '#3f3f46';
        ctx.fillRect(x, y, size, size);
      }

      // Metadata Overlay
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(beatTitle || 'Pyrex Trap Beat', canvas.width / 2, y + size + 45);

      // Produced by Pyrex Spinna (Strict Guardrail)
      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('Produced by Pyrex Spinna', canvas.width / 2, y + size + 75);

      // BPM & Key Tag
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '13px monospace';
      ctx.fillText(`${bpm} BPM  |  ${musicalKey}`, canvas.width / 2, y + size + 105);

      // Audio Visualizer Bars
      const barCount = 20;
      const barWidth = 10;
      const spacing = 6;
      const totalWidth = barCount * (barWidth + spacing);
      const startX = (canvas.width - totalWidth) / 2;
      const vizY = y + size + 145;

      for (let i = 0; i < barCount; i++) {
        const h = Math.abs(Math.sin(elapsed * 8 + i * 0.4)) * 45 + 10;
        ctx.fillStyle = i % 2 === 0 ? '#9333ea' : '#c084fc';
        ctx.fillRect(startX + i * (barWidth + spacing), vizY - h, barWidth, h);
      }

      // TikTok watermark / footer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '11px sans-serif';
      ctx.fillText('TikTok Viral Promo • Pyrex Spinna', canvas.width / 2, canvas.height - 30);

      animationRef.current = requestAnimationFrame(renderPreview);
    };

    renderPreview();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [beatTitle, artist, bpm, musicalKey, artworkUrl]);

  // Handle Video Rendering & Download for TikTok
  const handleGenerateTikTokVideo = async () => {
    setIsGenerating(true);
    setProgress(15);

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setIsGenerating(false);
        return;
      }

      // Set Full 9:16 HD resolution for TikTok
      canvas.width = 720;
      canvas.height = 1280;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) {
        setIsGenerating(false);
        return;
      }

      let imgObj = new Image();
      imgObj.crossOrigin = 'anonymous';
      imgObj.src = artworkUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80';
      await new Promise((resolve) => {
        imgObj.onload = resolve;
        imgObj.onerror = resolve;
      });

      setProgress(40);

      const stream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : null;
      if (!stream) {
        alert('Canvas video recording is not supported in this browser.');
        setIsGenerating(false);
        return;
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm'
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoDownloadUrl(url);
        setIsGenerating(false);
        setProgress(100);

        // Auto trigger download for iPad / device media library
        const a = document.createElement('a');
        a.href = url;
        a.download = `${beatTitle.replace(/[^a-zA-Z0-9]/g, '_')}_PyrexSpinna_TikTok.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      recorder.start();
      setProgress(60);

      // Render 5 seconds of video frames
      let frameCount = 0;
      const totalFrames = 150; // 5 seconds at 30fps

      const drawFrame = () => {
        if (frameCount >= totalFrames) {
          recorder.stop();
          return;
        }

        const elapsed = frameCount / 30;
        ctx.fillStyle = '#0a0a0c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Background Gradient
        const grad = ctx.createRadialGradient(360, 640, 40, 360, 640, 600);
        grad.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
        grad.addColorStop(1, 'rgba(10, 10, 12, 1)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Artwork
        const pulse = Math.sin(elapsed * 4) * 12;
        const size = 480 + pulse;
        const x = (canvas.width - size) / 2;
        const y = 240;

        ctx.save();
        ctx.shadowColor = 'rgba(168, 85, 247, 0.6)';
        ctx.shadowBlur = 40;
        ctx.fillStyle = '#18181b';
        ctx.fillRect(x - 8, y - 8, size + 16, size + 16);
        ctx.restore();

        try {
          ctx.drawImage(imgObj, x, y, size, size);
        } catch (e) {
          ctx.fillStyle = '#3f3f46';
          ctx.fillRect(x, y, size, size);
        }

        // Text
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText(beatTitle || 'Pyrex Trap Beat', canvas.width / 2, y + size + 80);

        // Produced by Pyrex Spinna (Strict Guardrail)
        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText('Produced by Pyrex Spinna', canvas.width / 2, y + size + 130);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '24px monospace';
        ctx.fillText(`${bpm} BPM  |  ${musicalKey}`, canvas.width / 2, y + size + 180);

        // Visualizer
        const barCount = 24;
        const barWidth = 18;
        const spacing = 10;
        const totalW = barCount * (barWidth + spacing);
        const startX = (canvas.width - totalW) / 2;
        const vizY = y + size + 250;

        for (let i = 0; i < barCount; i++) {
          const h = Math.abs(Math.sin(elapsed * 10 + i * 0.35)) * 90 + 20;
          ctx.fillStyle = i % 2 === 0 ? '#9333ea' : '#c084fc';
          ctx.fillRect(startX + i * (barWidth + spacing), vizY - h, barWidth, h);
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '20px sans-serif';
        ctx.fillText('TikTok Viral Promo • Pyrex Spinna Beat Store', canvas.width / 2, canvas.height - 50);

        frameCount++;
        setProgress(60 + Math.floor((frameCount / totalFrames) * 35));
        setTimeout(drawFrame, 33);
      };

      drawFrame();

    } catch (err) {
      console.error('TikTok video generation error:', err);
      setIsGenerating(false);
      alert('Failed to generate TikTok video. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-zinc-950/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Video size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">TikTok Promo Generator</h3>
            <p className="text-xs text-neutral-400">Render 9:16 vertical viral promo video for TikTok</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-full text-xs font-mono font-semibold">
          9:16 HD
        </span>
      </div>

      {/* 9:16 Vertical Video Preview Container */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-[240px] h-[426px] bg-black rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.2)] flex items-center justify-center">
          <canvas ref={previewCanvasRef} className="w-full h-full object-cover" />
          
          <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-purple-300">
            PREVIEW
          </div>
        </div>
      </div>

      {/* Hidden high-res canvas for recording */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Generator Progress bar if generating */}
      {isGenerating && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-neutral-300 font-mono">
            <span>Rendering TikTok Promo Video...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Prominent TikTok Export Action */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleGenerateTikTokVideo}
          disabled={isGenerating}
          className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_4px_25px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Sparkles className="animate-spin" size={20} />
              <span>Rendering Video ({progress}%)...</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Download TikTok Promo Video</span>
            </>
          )}
        </button>

        {videoDownloadUrl && (
          <a
            href={videoDownloadUrl}
            download={`${beatTitle.replace(/[^a-zA-Z0-9]/g, '_')}_PyrexSpinna_TikTok.webm`}
            className="w-full py-3 px-4 rounded-xl font-semibold text-center text-purple-300 bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/40 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Download size={16} />
            <span>Click Here if Download Didn't Start Automatically</span>
          </a>
        )}
      </div>

      <div className="text-center text-[11px] text-neutral-500">
        Saved directly to your device/iPad media library. Ready for instant upload to TikTok & Instagram Reels.
      </div>
    </div>
  );
}
