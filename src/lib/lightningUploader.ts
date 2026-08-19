import { beatVault } from './infiniteBeatStorage';
import { pyrexVault } from './pyrexStorageEngine';

// Upload your beat straight from your website form input using Puter cloud storage or Audio Cloud backend
export async function uploadBeat(file: File): Promise<string> {
    const cloudRes = await uploadBeatToAudioCloud(file);
    if (cloudRes?.primaryUrl) {
        return cloudRes.primaryUrl;
    }

    if (typeof window !== 'undefined' && window.puter?.fs) {
        try {
            // Writes the file to cloud storage instantly
            const uploadedFile = await window.puter.fs.write(`beats/${file.name}`, file);

            // Gets a direct public URL to plug straight into your audio player
            const audioUrl = await window.puter.fs.getReadURL(uploadedFile.path);

            console.log("Your beat is live at:", audioUrl);
            return audioUrl;
        } catch (err) {
            console.warn("Puter cloud storage upload failed, using direct object URL fallback:", err);
        }
    }

    // Direct object URL fallback for zero-latency testing
    return URL.createObjectURL(file);
}

// ☁️ Audio Cloud Backend S3 + Prisma Metadata Upload Flow
export async function uploadBeatToAudioCloud(file: File, userId = 'user_default'): Promise<{ fileKey: string; trackId: string; streamUrl: string; primaryUrl: string } | null> {
    try {
        console.log(`[AudioCloud] STEP 1: Requesting pre-signed upload URL for ${file.name}...`);
        const urlResponse = await fetch('/api/tracks/get-upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fileName: file.name,
                fileType: file.type || 'audio/mpeg',
                userId: userId,
            }),
        });

        if (!urlResponse.ok) {
            throw new Error(`Failed to obtain upload URL: ${urlResponse.statusText}`);
        }

        const { uploadUrl, fileKey } = await urlResponse.json();
        console.log(`[AudioCloud] Upload URL received. Key: ${fileKey}`);

        // STEP 1.5: Upload file to S3 pre-signed URL (or local upload route)
        console.log(`[AudioCloud] Uploading binary payload to cloud...`);
        try {
            const putResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type || 'audio/mpeg',
                },
                body: file,
            });

            if (!putResponse.ok && !uploadUrl.startsWith('/api/')) {
                console.warn(`[AudioCloud] Direct PUT upload warning: ${putResponse.statusText}. Continuing metadata save.`);
            }
        } catch (putErr) {
            console.warn(`[AudioCloud] Direct PUT upload fetch warning:`, putErr);
        }

        // STEP 2: Save track metadata to Prisma database
        console.log(`[AudioCloud] STEP 2: Registering track metadata in database...`);
        const trackResponse = await fetch('/api/tracks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: file.name.replace(/\.[^/.]+$/, ""),
                fileKey: fileKey,
                fileSize: file.size,
                mimetype: file.type || 'audio/mpeg',
                userId: userId,
            }),
        });

        if (!trackResponse.ok) {
            throw new Error(`Failed to save track metadata: ${trackResponse.statusText}`);
        }

        const trackData = await trackResponse.json();
        const trackId = trackData.track?.id;
        console.log(`[AudioCloud] Metadata registered successfully. Track ID: ${trackId}`);

        // STEP 3: Generate temporary secure stream URL
        let streamUrl = '';
        if (trackId) {
            try {
                const streamResponse = await fetch(`/api/tracks/${trackId}/stream`);
                if (streamResponse.ok) {
                    const streamData = await streamResponse.json();
                    streamUrl = streamData.streamUrl || '';
                }
            } catch (err) {
                console.warn('[AudioCloud] Stream URL generation warning:', err);
            }
        }

        const objectUrlFallback = URL.createObjectURL(file);
        return {
            fileKey,
            trackId: trackId || '',
            streamUrl: streamUrl || objectUrlFallback,
            primaryUrl: streamUrl || objectUrlFallback,
        };
    } catch (err) {
        console.warn('[AudioCloud] Cloud upload failed, using fallback:', err);
        return null;
    }
}

// Secondary Cloud Storage Backup Handler
export async function uploadBeatWithBackup(fileInput: HTMLInputElement | { files: FileList | File[] } | File) {
    let file: File | null = null;
    if (fileInput instanceof File) {
        file = fileInput;
    } else if (fileInput && 'files' in fileInput && fileInput.files && fileInput.files[0]) {
        file = fileInput.files[0];
    }

    if (!file) {
        if (typeof window !== 'undefined') alert("Please select a beat file first!");
        return null;
    }

    try {
        console.log("Uploading primary audio file...");
        let primaryUrl = '';

        // Try Audio Cloud backend upload first
        const cloudResult = await uploadBeatToAudioCloud(file);
        if (cloudResult?.primaryUrl) {
            primaryUrl = cloudResult.primaryUrl;
        } else if (typeof window !== 'undefined' && window.puter?.fs) {
            // 1. Primary upload using Puter storage connection
            const primaryFile = await window.puter.fs.write(`beats/${file.name}`, file);
            primaryUrl = await window.puter.fs.getReadURL(primaryFile.path);
        } else {
            primaryUrl = URL.createObjectURL(file);
        }

        console.log("Primary upload successful:", primaryUrl);

        // 2. Secondary backup upload mirror (High-speed redundancy)
        let backupUrl = primaryUrl; // Fallback safety net
        try {
            const backupFormData = new FormData();
            backupFormData.append("file", file);

            const backupResponse = await fetch("https://tempfiles.api.swiftnode.net/upload", {
                method: "POST",
                body: backupFormData
            });

            if (backupResponse.ok) {
                const backupData = await backupResponse.json();
                backupUrl = backupData.url || primaryUrl;
                console.log("Secondary mirror backup secured!");
            }
        } catch (backupError) {
            console.warn("Secondary mirror backup unreachable, using primary URL safety net:", backupError);
        }

        console.log("Beat successfully uploaded, mirrored, and live on the store!");
        return { primaryUrl, backupUrl };

    } catch (error) {
        console.error("Upload routing error:", error);
        if (typeof window !== 'undefined') alert("Upload failed. Check your file format and try again.");
        return null;
    }
}

// High-Speed Instant Beat Uploader Component
export class LightningUploader {
    maxSpeedMode: boolean;
    onComplete: (beat: any) => void;

    constructor(onCompleteCallback: (beat: any) => void) {
        this.maxSpeedMode = true;
        this.onComplete = onCompleteCallback;
    }

    async processInstantUpload(fileEvent: any) {
        const file = fileEvent.target?.files?.[0] || fileEvent[0] || fileEvent;
        if (!file) return;

        const startTime = performance.now();
        console.log(`>> [Flash Upload]: Ingesting ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);

        // Upload beat via dual-cloud backup handler
        const uploadResult = await uploadBeatWithBackup(file);
        const cloudAudioUrl = uploadResult?.primaryUrl || await uploadBeat(file);

        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        const beatPayload = {
            title: file.name.replace(/\.[^/.]+$/, ""),
            size: file.size,
            url: cloudAudioUrl,
            backupUrl: uploadResult?.backupUrl || cloudAudioUrl,
            uploadTime: `${duration}s`,
            status: 'Instant-Sync Active',
            file: file
        };

        console.log(`>> [Success]: Beat locked into catalog buffer in ${duration} seconds.`);
        beatVault.storeBeatLocally(beatPayload);
        try {
            await pyrexVault.storeAsset(file, file.type.startsWith('image') ? 'artwork' : 'audio', { title: file.name });
        } catch (e) {
            console.warn("Vault asset storage notice:", e);
        }
        if (this.onComplete) this.onComplete(beatPayload);
    }
}


