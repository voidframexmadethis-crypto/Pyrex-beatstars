/**
 * Client-side Internet Archive Upload Utility matching user specification
 */
export async function uploadBeatToArchive(file: File, beatTitle: string, accessKey: string = "", secretKey: string = "") {
  // Generate a unique item/bucket identifier
  const identifier = `beatstore-${beatTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;
  const fileName = file.name;
  
  // Internet Archive S3 endpoint structure
  const uploadUrl = `https://s3.us.archive.org/${identifier}/${fileName}`;

  try {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Authorization": `LOW ${accessKey}:${secretKey}`,
        "x-archive-meta-mediatype": "audio",
        "x-archive-auto-make-bucket": "1",
        "Content-Type": "audio/mp4"
      },
      body: file
    });

    if (response.ok) {
      const publicUrl = `https://archive.org/download/${identifier}/${fileName}`;
      console.log("Successfully uploaded! Stream URL:", publicUrl);
      return publicUrl;
    } else {
      const errText = await response.text();
      console.error("Archive upload error:", errText);
      throw new Error(`Upload failed: ${errText}`);
    }
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}
