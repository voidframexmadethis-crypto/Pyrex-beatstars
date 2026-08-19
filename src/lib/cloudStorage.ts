import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Your external cloud storage public bucket URL (e.g., Cloudflare R2 or AWS S3 CDN)
const CLOUD_STORAGE_BASE_URL = 'https://cdn.pyrex.com/beats';

export interface CloudTrack {
  id: string;
  title: string;
  producer: string;
  price: number;
  audioUrl: string;
  stemUrl?: string;
  coverArt: string;
}

// Assets stream directly from cloud storage, keeping Vercel bandwidth at zero
export function getCloudAssetUrl(filePath: string): string {
  return `${CLOUD_STORAGE_BASE_URL}/${filePath}`;
}

// Initialize the global cloud storage connection setup
// These are server-side only secrets
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Generates a highly secure, temporary download link for purchased beat trackouts.
 * This prevents public asset URL leaking, exactly like Airbit or BeatStars structures.
 */
export async function getSecureTrackDownloadUrl(trackKey: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: trackKey, // e.g., "producers/pyrex/stems/fire_beat_trackouts.zip"
  });

  // Link automatically expires in 1 hour (3600 seconds) after purchase validation
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return signedUrl;
}

/**
 * Uploads raw untagged audio or stem zip files straight into your storage mass.
 */
export async function uploadAudioToMassStorage(fileBuffer: Buffer, fileName: string, mimeType: string) {
  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `tracks/${Date.now()}_${fileName}`,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  try {
    const response = await s3Client.send(uploadCommand);
    return response;
  } catch (error) {
    console.error("Cloud storage mass upload failed:", error);
    throw error;
  }
}
