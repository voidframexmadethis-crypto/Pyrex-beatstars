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

export const createServicesRouter = (): Router => {
  const router = express.Router();

  router.post('/api/services/book', async (req, res) => {
    try {
      const { serviceTier, price, clientEmail } = req.body;
      const resend = getResend();

      if (!serviceTier || !price || !clientEmail) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Send the booking notification to admin
      await resend.emails.send({
        from: 'Krypside Engineering <engineering@krypside.vercel.app>',
        to: 'krypside@gmail.com',
        subject: `🎧 New Booking: ${serviceTier}`,
        html: `
          <div style="background: #000; color: #fff; padding: 25px; font-family: sans-serif; border-radius: 8px; border: 1px solid #3b82f6;">
            <h3 style="color: #3b82f6; margin-top: 0;">New Service Booking</h3>
            <p><strong>Service:</strong> ${serviceTier}</p>
            <p><strong>Price:</strong> $${price}</p>
            <p><strong>Client Email:</strong> ${clientEmail}</p>
          </div>
        `,
      });

      res.status(200).json({ success: true, message: "Booking request received." });

    } catch (error: any) {
      console.error("Booking error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
