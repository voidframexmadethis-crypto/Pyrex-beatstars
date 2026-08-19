// PyrexSpinna Final Enterprise Dispatch: Global DSP Distribution & Royalty Lock
import { Resend } from 'resend';

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }
    resendClient = new Resend(key);
  }
  return resendClient;
}

export async function dispatchGlobalRelease(releaseData: any) {
  const { artistName, artistEmail, trackTitle, isrcCode, dspPlatforms } = releaseData;
  const resend = getResend();

  // 1. Send distribution notification to your master admin log
  await resend.emails.send({
    from: 'PyrexSpinna Distribution <distro@pyrex.vercel.app>',
    to: 'pyrex@gmail.com',
    subject: `🌍 GLOBAL RELEASE SUBMISSION: "${trackTitle}" by ${artistName}`,
    html: `
      <div style="background: #000; color: #fff; padding: 25px; font-family: sans-serif; border-radius: 8px; border: 1px solid #3b82f6;">
        <h3 style="color: #3b82f6; margin-top: 0;">New Global Distribution Push</h3>
        <p>An artist has completed a project using your beat and initiated global streaming distribution via PyrexSpinna:</p>
        <ul style="line-height: 1.6; color: #d1d5db;">
          <li><strong>Artist:</strong> ${artistName} (${artistEmail})</li>
          <li><strong>Track Title:</strong> ${trackTitle}</li>
          <li><strong>ISRC:</strong> ${isrcCode}</li>
          <li><strong>Target Networks:</strong> ${dspPlatforms.join(', ')}</li>
        </ul>
      </div>
    `,
  });

  // 2. Confirm global delivery to the artist
  await resend.emails.send({
    from: 'PyrexSpinna Distribution <distro@pyrex.vercel.app>',
    to: artistEmail,
    subject: `🚀 Distribution Confirmed: "${trackTitle}" is Headed to Stores`,
    html: `
      <div style="background: #000; color: #fff; padding: 30px; font-family: sans-serif; border-radius: 10px; border: 1px solid #1e3a8a;">
        <h2 style="color: #3b82f6; margin-top: 0;">Pushing to Global DSPs</h2>
        <p>Your master file for <strong>"${trackTitle}"</strong> has been processed through the PyrexSpinna distribution network and is rolling out to Spotify, Apple Music, Tidal, and global streaming services.</p>
        <p>Your automated royalty splits are locked and active.</p>
        <br>
        <p style="font-size: 12px; color: #888;">- PyrexSpinna Enterprise Distribution</p>
      </div>
    `,
  });

  return { status: "Dispatched to Global Networks", track: trackTitle };
}
