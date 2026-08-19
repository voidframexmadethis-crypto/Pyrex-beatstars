import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

/**
 * Automates the complete audio mastering and compression pipeline.
 * Converts raw producer uploads into studio-grade 320kbps streaming assets.
 * 
 * @param {string} sourceFile - Path to the raw, untouched uploaded file (.wav or .mp3)
 * @param {string} targetExportPath - Destination path where the clean 320kbps file will be saved
 * @return { Promise<string> } - Resolves with the path of the ready file
 */
export function runHighFidelityPipeline(sourceFile: string, targetExportPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        
        // 1. Fail-Safe Directory Generation
        const destinationDirectory = path.dirname(targetExportPath);
        if (!fs.existsSync(destinationDirectory)) {
            fs.mkdirSync(destinationDirectory, { recursive: true });
        }

        // 2. Execute Native Cloud Engine Command
        ffmpeg(sourceFile)
            
            // --- STEP A: LOUDNESS NORMALIZATION & PEAK PROTECTION ---
            // Target integrated loudness of -12 LUFS keeps your tracks aggressive and loud.
            // Setting the True Peak (TP) ceiling straight to -1.0 protects your mix,
            // completely stopping the browser's native decoder from clipping or distorting.
            .audioFilters([
                'loudnorm=I=-12:TP=-1.0:LRA=11:print_format=json'
            ])

            // --- STEP B: 320KBPS HIGH-SPEED TRANSCODING ---
            // Drops marketplace compression down to 0. Forces full, unthrottled 320kbps density.
            .audioCodec('libmp3lame')
            .audioBitrate(320)
            
            // --- STEP C: STEREO SOUNDSTAGE LOCK ---
            // Guarantees your wide panning, delays, and stereo 808s never get flattened into mono.
            .audioChannels(2)
            .audioFrequency(44100)

            // --- STEP D: ENGINE MONITORING LOGS ---
            .on('start', (commandLine) => {
                console.log('High-Fidelity Audio Core Initiated Successfully.', commandLine);
            })
            .on('progress', (progress) => {
                if (progress.percent) {
                    console.log(`Processing audio stream frames: ${Math.round(progress.percent)}% done.`);
                }
            })
            
            // --- STEP E: NATURAL COMPLETION HOOK ---
            .on('end', () => {
                console.log('Transcoding complete! Studio-grade 320kbps asset written safely to storage.');
                
                // CRUCIAL IPAD/CLOUD FAIL-SAFE: Reclaim server disk space instantly.
                // Erases the temporary raw source file so your cloud slice never logs a memory leak.
                try {
                    if (fs.existsSync(sourceFile)) {
                        fs.unlinkSync(sourceFile);
                        console.log('Temporary upload cache purged from local memory.');
                    }
                } catch (cleanupError: any) {
                    console.warn('System disk cleanup skipped or file already moved:', cleanupError.message);
                }

                resolve(targetExportPath);
            })
            
            // --- STEP F: CRITICAL CRASH PROTECTION CATCH ---
            .on('error', (pipelineError) => {
                console.error('Core Pipeline processing halted due to an internal fault:', pipelineError.message);
                
                // Clean up files even if the conversion errors out to protect system boundaries
                if (fs.existsSync(sourceFile)) {
                    try { fs.unlinkSync(sourceFile); } catch (e) {}
                }
                reject(pipelineError);
            })
            
            // Execute the system-level matrix command
            .save(targetExportPath);
    });
}
