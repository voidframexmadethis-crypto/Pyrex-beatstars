import express, { Router } from 'express';
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

export const createMailingRouter = (): Router => {
  const router = express.Router();

  router.post('/api/mailing/subscribe', async (req, res) => {
    try {
      const { artistEmail } = req.body;
      const resend = getResend();

      if (!artistEmail) {
        return res.status(400).json({ error: "Email is required" });
      }

      // 1. Send the automated welcome email to the artist
      await resend.emails.send({
        from: 'Krypside <notifications@krypside.vercel.app>',
        to: artistEmail,
        subject: 'Welcome to Krypside | Exclusive Beats & Vault Access',
        html: `
          <div style="background: #000; color: #fff; padding: 30px; font-family: sans-serif; border-radius: 10px; border: 1px solid #1e3a8a;">
            <h2 style="color: #3b82f6; margin-top: 0;">You're on the Inside.</h2>
            <p>Welcome to the Krypside network. You're now locked in for direct drops, heavy sound kits, and fresh beat releases straight from the vault.</p>
            <p>Stay tuned for the next upload.</p>
            <br>
            <p style="font-size: 12px; color: #888;">- Krypside Production</p>
          </div>
        `,
      });

      // 2. Send the notification alert to your personal inbox
      await resend.emails.send({
        from: 'Krypside System <notifications@krypside.vercel.app>',
        to: 'krypside@gmail.com',
        subject: '🔥 New Artist Subscribed to Krypside!',
        html: `
          <div style="background: #000; color: #fff; padding: 25px; font-family: sans-serif; border-radius: 8px;">
            <h3 style="color: #3b82f6; margin-top: 0;">New Mailing List Signup</h3>
            <p>An artist just joined your mailing list:</p>
            <p style="background: #111; padding: 12px; border-radius: 6px; border: 1px solid #333;"><strong>Email:</strong> ${artistEmail}</p>
            <p style="font-size: 12px; color: #888; margin-top: 15px;">Captured via Krypside storefront frontend.</p>
          </div>
        `,
      });

      res.status(200).json({ success: true, message: "Subscribed and notifications sent successfully." });

    } catch (error: any) {
      console.error("Mailing list error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
