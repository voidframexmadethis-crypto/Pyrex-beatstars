// PyrexSpinna -> The Award Group Direct Dispatch Pipeline
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Your exact personal milestone stream tiers
const PYREX_MILESTONE_TIERS = [
  { tier: 1, streams: 100, plaqueName: "Independent Kickoff Plaque" },
  { tier: 2, streams: 800, plaqueName: "Standard Tier Certified Plaque" },
  { tier: 3, streams: 1255, plaqueName: "Growth Milestone Award" },
  { tier: 4, streams: 100000, plaqueName: "Gold Certified Edition Plaque" },
  { tier: 5, streams: 1002000, plaqueName: "Diamond Million-Stream Masterpiece" }
];

export async function checkAndDispatchMilestonePlaque(currentTotalStreams: number, creatorDetails: any) {
  // Determine the highest milestone tier unlocked
  const unlockedTier = [...PYREX_MILESTONE_TIERS].reverse().find(m => currentTotalStreams >= m.streams);

  if (!unlockedTier) {
    return { status: "Milestone threshold not met yet." };
  }

  // Structured payload for custom manufacturing
  const plaqueOrderSpecs = {
    manufacturer: "The Award Group",
    artist: creatorDetails.name,
    projectTitle: creatorDetails.releaseTitle,
    tierAchieved: unlockedTier.plaqueName,
    streamCount: currentTotalStreams,
    frameFinish: "Midnight Black & Blue Metallic Custom",
    shippingAddress: creatorDetails.shippingAddress,
    timestamp: new Date().toISOString()
  };

  try {
    // Send the direct order requisition to production & notify your inbox
    await resend.emails.send({
      from: 'PyrexSpinna Automation <dispatch@pyrex.vercel.app>',
      to: 'customerservice@theawardgroup.com', // Direct production intake endpoint
      cc: creatorDetails.personalEmail,
      subject: `🏆 PRODUCTION REQUISITION: ${unlockedTier.plaqueName} - ${creatorDetails.name}`,
      html: `
        <div style="background: #000; color: #fff; padding: 30px; font-family: sans-serif; border-radius: 10px; border: 2px solid #3b82f6;">
          <h2 style="color: #3b82f6; margin-top: 0;">PyrexSpinna Enterprise - Plaque Requisition</h2>
          <p>A verified streaming benchmark has been achieved on the PyrexSpinna network. Please process the following custom manufacturing specifications:</p>
          <ul style="line-height: 1.6; color: #d1d5db;">
            <li><strong>Award Tier:</strong> ${plaqueOrderSpecs.tierAchieved}</li>
            <li><strong>Verified Streams:</strong> ${plaqueOrderSpecs.streamCount.toLocaleString()}</li>
            <li><strong>Creator Name:</strong> ${plaqueOrderSpecs.artist}</li>
            <li><strong>Release:</strong> ${plaqueOrderSpecs.projectTitle}</li>
            <li><strong>Frame Customization:</strong> ${plaqueOrderSpecs.frameFinish}</li>
          </ul>
          <hr style="border-color: #1f2937; margin: 20px 0;">
          <p style="font-size: 12px; color: #9ca3af;">Automated dispatch generated via PyrexSpinna backend on ${plaqueOrderSpecs.timestamp}.</p>
        </div>
      `,
    });

    return { 
      status: "Success", 
      tier: unlockedTier.plaqueName,
      specs: plaqueOrderSpecs 
    };

  } catch (error: any) {
    console.error("Error dispatching plaque order:", error);
    return { status: "Error", message: error.message };
  }
}
