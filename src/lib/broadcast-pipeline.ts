import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

/**
 * Orchestrates the full automatic broadcast pipeline from website to TikTok.
 * 
 * @param {string} rawAudioPath - Path to the pristine uploaded beat file.
 * @param {string} artworkImagePath - Path to your brand cover art or profile background.
 * @param {string} beatTitle - Name of your beat to use in the video caption.
 */
export async function triggerAutoBroadcastPipeline(rawAudioPath: string, artworkImagePath: string, beatTitle: string) {
    const outputDir = path.join(process.cwd(), 'local_storage', 'output_shorts');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const renderedVideoPath = path.join(outputDir, `${Date.now()}_tiktok.mp4`);

    try {
        console.log(`[BROADCAST] Starting automated short-form video render for: ${beatTitle}`);
        
        // 1. STITCH AUDIO AND ARTWORK INTO A VERTICAL VIDEO FILE
        await new Promise<void>((resolve, reject) => {
            ffmpeg()
                .input(artworkImagePath)
                .loop() // Keeps the single image static throughout the video duration
                .input(rawAudioPath)
                .outputOptions([
                    '-c:v libx264',      // Modern, highly compatible web video codec
                    '-tune stillimage',  // Optimizes encoding process for static artwork files
                    '-c:a aac',          // Packs crisp audio tracking quality
                    '-b:a 320k',         // Locks streaming audio bitrate to maximum clarity
                    '-pix_fmt yuv420p',  // Standard video pixel formatting required by mobile players
                    '-shortest'          // Terminates video automatically the exact second the audio ends
                ])
                // Forces a standard vertical smartphone screen format configuration
                .videoFilters('scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920')
                .save(renderedVideoPath)
                .on('end', () => {
                    console.log("[BROADCAST] Video render complete.");
                    resolve();
                })
                .on('error', (err) => {
                    console.error("[BROADCAST] Render error:", err);
                    reject(err);
                });
        });

        const tiktokAccessToken = process.env.TIKTOK_SECURE_AUTH_TOKEN;
        if (!tiktokAccessToken) {
            console.warn("[BROADCAST] TikTok access token missing. Skipping upload step.");
            // We still rendered the video, so maybe we want to keep it? 
            // The user's code unlinks it in the catch/finally block usually.
            // For now, if no token, we just stop.
            return;
        }

        console.log("[BROADCAST] Initiating direct cloud stream to TikTok...");

        const initPayload = {
            post_info: {
                title: `${beatTitle} (Prod. By VOIDFRAME.X) #producer #beats #trapbeats`,
                privacy_level: "PUBLIC",
                allow_comment: true,
                allow_duet: true,
                allow_stitch: true,
                video_cover_timestamp_ms: 1000
            },
            source_info: {
                source: "FILE_UPLOAD",
                video_size: fs.statSync(renderedVideoPath).size
            }
        };

        // Initialize secure upload link stream endpoint with TikTok's endpoint server
        // Note: Using a placeholder URL if the user's provided 'https://tiktokapis.com' is illustrative
        const initResponse = await axios.post('https://open.tiktokapis.com/v2/post/publish/video/init/', initPayload, {
            headers: {
                'Authorization': `Bearer ${tiktokAccessToken}`,
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });

        const uploadUrl = initResponse.data.data.upload_url;

        // Binary stream transfer: Pipes the local video file straight to the provided network hook
        const videoStream = fs.createReadStream(renderedVideoPath);
        await axios.put(uploadUrl, videoStream, {
            headers: {
                'Content-Type': 'video/mp4',
                'Content-Length': fs.statSync(renderedVideoPath).size
            }
        });

        console.log(`[BROADCAST] Flawless broadcast! "${beatTitle}" is now live on your official TikTok channel.`);
        
        // 3. STORAGE SANITIZATION
        fs.unlinkSync(renderedVideoPath);

    } catch (error: any) {
        console.error("[BROADCAST] Content automation network pipeline failed to broadcast:", error.response ? error.response.data : error.message);
        // Fail-safe cleanup
        if (fs.existsSync(renderedVideoPath)) {
            try { fs.unlinkSync(renderedVideoPath); } catch (e) {}
        }
    }
}
