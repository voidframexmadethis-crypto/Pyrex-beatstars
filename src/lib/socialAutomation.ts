
/**
 * STAGE 1: Auto-generate the MP4 video using a video rendering service (Creatomate Bridge)
 * This calls our secure server-side endpoint which holds the API credentials
 */
export async function generatePromoVideo(audioUrl: string, imageUrl: string, title: string): Promise<string> {
  console.log(`[VideoGen] Proxying request to server bridge for: ${title}`);

  try {
    const response = await fetch('/api/automate/video-gen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audioUrl,
        imageUrl, 
        title
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate video');
    }

    // Returns a direct secure link to the newly rendered short-form MP4 video file
    console.log(`[VideoGen] Successfully received render link: ${data.url}`);
    return data.url; 
  } catch (error: any) {
    console.error('[VideoGen] Client Error:', error);
    throw error;
  }
}

/**
 * STAGE 2: Direct push the generated video straight to TikTok's API servers
 * This simulates the OAuth-authorized upload to a specific TikTok profile
 */
export async function uploadToTikTokProfile(videoUrl: string, caption: string, targetAccount: string): Promise<boolean> {
  console.log(`[TikTokAPI] Pushing to profile: @${targetAccount || 'default_producer'}`);
  console.log(`[TikTokAPI] Video: ${videoUrl}`);
  console.log(`[TikTokAPI] Caption: ${caption}`);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Logic for production:
  // 1. Initialize upload session with TikTok Video Kit API
  // 2. Stream the video file from generatedVideoUrl to TikTok
  // 3. Post with caption and privacy settings
  
  console.log(`[TikTokAPI] Post Successful!`);
  return true;
}

/**
 * Main automation bridge triggered immediately after beat metadata and files finish uploading
 */
export async function handlePostPublishAutomation(publishedBeatData: any, webUiToggles: any) {
  
  // 1. Check if the master and TikTok toggles are checked from your UI screen
  // Map the existing formData keys to the requested logic names if necessary
  const autoPostMasterToggle = webUiToggles.autoPostVideo || webUiToggles.autoPostMasterToggle;
  const tiktokShortFormSwitch = webUiToggles.tiktokVideoGen || webUiToggles.tiktokShortFormSwitch;

  if (autoPostMasterToggle && tiktokShortFormSwitch) {
    console.log("TikTok short-form auto-generation pipeline initiated...");

    try {
      // 2. STAGE 1: Auto-generate the MP4 video using a video rendering service
      const generatedVideoUrl = await generatePromoVideo(
        publishedBeatData.audioUrl, 
        publishedBeatData.coverArtUrl, 
        publishedBeatData.title
      );
      
      // 3. STAGE 2: Direct push the generated video straight to TikTok's API servers
      if (generatedVideoUrl) {
        await uploadToTikTokProfile(
          generatedVideoUrl, 
          `Listen to my brand new beat: "${publishedBeatData.title}"! Link in bio. #producer #beats`,
          webUiToggles.tiktokTargetChannel // Reads the input from your account text box
        );
      }
    } catch (error) {
      console.error("Automation pipeline encountered a roadblock:", error);
    }
  }
}
