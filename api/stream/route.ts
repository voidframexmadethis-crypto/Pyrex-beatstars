import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Forces the route to run on the ultra-fast global edge network memory layer
export const runtime = 'edge'; 

const edgeStorageClient = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * High-Speed Streaming Delivery Pipeline
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackKey = searchParams.get("trackKey"); // e.g., "beats/fire_beat.wav"

    if (!trackKey) {
      return new Response("Missing asset track identifier key", { status: 400 });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET || process.env.AWS_S3_BASE_BUCKET || "pyrex-spinna-mass-vault",
      Key: trackKey,
    });

    // Generate an expiring stream URL right at the network edge
    const fastStreamingUrl = await getSignedUrl(edgeStorageClient, command, { 
      expiresIn: 1800 
    });

    // Return the URL with aggressive browser caching parameters to prevent reloading lag
    return new Response(JSON.stringify({ url: fastStreamingUrl }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=30",
      },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
