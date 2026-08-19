import express, { Router } from 'express';
import { PrismaClient } from '../generated/client/client.js';
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

export const createPlaqueRouter = (prisma: PrismaClient | null): Router => {
  const router = express.Router();

  router.post('/api/plaques/order', async (req, res) => {
    try {
      const { artistName, releaseTitle, milestoneType, frameStyle, buyerEmail, customerShippingAddress, price } = req.body;
      const resend = getResend();

      // 1. Record plaque order
      let plaqueOrder: any = null;
      if (prisma) {
        plaqueOrder = await prisma.recordPlaque.create({
          data: {
            artistName,
            releaseTitle,
            milestoneType,
            frameStyle,
            verificationSourceUrl: req.body.verificationSourceUrl || '',
            customerShippingAddress: customerShippingAddress,
            orderStatus: 'Pending Verification',
            price: Number(price)
          }
        });
      } else {
        console.warn("Prisma client not initialized, skipping recordPlaque creation.");
      }

      // 2. Send emails
      const plaqueId = plaqueOrder ? plaqueOrder.plaqueId : 'TBD';
      
      // Confirmation to artist
      await resend.emails.send({
        from: 'Krypside Awards <awards@krypside.vercel.app>',
        to: buyerEmail,
        subject: `🏆 Plaque Order Confirmed: ${releaseTitle} (${milestoneType})`,
        html: `
          <div style="background: #000; color: #fff; padding: 25px; font-family: sans-serif; border-radius: 8px; border: 1px solid #1e3a8a;">
            <h2 style="color: #3b82f6; margin-top: 0;">Milestone Plaque In Production</h2>
            <p>Congratulations, <strong>${artistName}</strong>! Your custom <strong>${milestoneType}</strong> plaque for <em>${releaseTitle}</em> with a <strong>${frameStyle}</strong> finish has been logged into our workshop queue.</p>
            <p>We will email you tracking details the moment your heavy-duty custom frame ships out.</p>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">Plaque Reference ID: ${plaqueId}</p>
          </div>
        `,
      });

      // Notification to you
      await resend.emails.send({
        from: 'Krypside System <notifications@krypside.vercel.app>',
        to: 'glennbucky@gmail.com',
        subject: `🔥 NEW PLAQUE ORDER: ${milestoneType} for ${artistName}`,
        html: `
          <div style="background: #000; color: #fff; padding: 20px; font-family: sans-serif; border-radius: 8px;">
            <h2>New Plaque Order Received!</h2>
            <p><strong>Artist:</strong> ${artistName}</p>
            <p><strong>Release:</strong> ${releaseTitle}</p>
            <p><strong>Milestone:</strong> ${milestoneType}</p>
            <p><strong>Frame Style:</strong> ${frameStyle}</p>
          </div>
        `,
      });

      res.status(201).json({ success: true, plaqueId });
    } catch (error) {
      console.error('Failed to process plaque request:', error);
      res.status(500).json({ error: 'Failed to process order' });
    }
  });

  return router;
};
