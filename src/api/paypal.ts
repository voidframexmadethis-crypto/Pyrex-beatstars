import express, { Router } from 'express';
import { PrismaClient } from '../generated/client/client.js';

// Your Personal PayPal Verified Endpoint
const PERSONAL_PAYPAL_EMAIL = process.env.PERSONAL_PAYPAL_EMAIL;

export const createPaypalRouter = (prisma: PrismaClient | null): Router => {
  const router = express.Router();

  router.post('/api/checkout/paypal-webhook', async (req, res) => {
    const event = req.body;

    // Verify the payment is completed and sent directly to your personal account
    if (event.event_type === 'PAYMENT.SALE.COMPLETED') {
      const sale = event.resource;
      const recipientEmail = sale.payee_payment_email_address || sale.receiver_email;
      
      if (!PERSONAL_PAYPAL_EMAIL || recipientEmail.toLowerCase() !== PERSONAL_PAYPAL_EMAIL.toLowerCase()) {
        return res.status(400).json({ error: 'Security Alert: Payment routing mismatch.' });
      }

      const buyerEmail = sale.custom || (sale.payer && sale.payer.payer_info ? sale.payer.payer_info.email : null);
      const amountPaid = parseFloat(sale.amount.total);
      const trackId = sale.invoice_number; // Mapped to your master track ID

      // Record transaction and lock in the buyer's email for your marketing list
      if (prisma) {
        await prisma.transaction.create({
          data: {
            trackId: trackId,
            buyerEmail: buyerEmail || 'unknown@example.com',
            licenseType: sale.item_list && sale.item_list.items ? sale.item_list.items[0].name : 'Standard Lease',
            amountPaid: amountPaid,
            paymentGateway: 'PayPal (Personal Direct)',
            licensePdfUrl: `/vault_storage/licenses/license_${Date.now()}.pdf`
          }
        });
      } else {
        console.warn("Prisma client not initialized, skipping transaction recording.");
      }

      // Send confirmation emails
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const beatTitle = sale.item_list && sale.item_list.items ? sale.item_list.items[0].name : 'Unknown Beat';
        const licenseType = sale.item_list && sale.item_list.items ? sale.item_list.items[0].description : 'Standard Lease';

        // 1. Send alert to you
        await resend.emails.send({
          from: 'Krypside Alerts <onboarding@resend.dev>',
          to: 'glennbucky@gmail.com',
          subject: `🔥 NEW SALE: ${beatTitle} (${licenseType})`,
          html: `
            <div style="background: #000; color: #fff; padding: 20px; font-family: sans-serif; border-radius: 8px;">
              <h2 style="color: #3b82f6;">Krypside Enterprise Alert</h2>
              <p><strong>Beat Sold:</strong> ${beatTitle}</p>
              <p><strong>License Tier:</strong> ${licenseType}</p>
              <p><strong>Buyer:</strong> ${buyerEmail || 'Unknown'}</p>
              <p><strong>Amount:</strong> $${amountPaid}</p>
            </div>
          `,
        });

        // 2. Dispatch download link to buyer
        if (buyerEmail) {
          await resend.emails.send({
            from: 'Krypside <onboarding@resend.dev>',
            to: buyerEmail,
            subject: `Your Files & License for ${beatTitle}`,
            html: `
              <div style="background: #000; color: #fff; padding: 20px; font-family: sans-serif; border-radius: 8px;">
                <h2>Thank you for your purchase!</h2>
                <p>Your secure download vault and custom license agreement for <strong>${beatTitle}</strong> are ready.</p>
                <a href="https://krypside.vercel.app/vault" style="background: #3b82f6; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 15px;">Access Download Vault</a>
              </div>
            `,
          });
        }
      } catch (emailError) {
        console.error('Failed to send checkout emails:', emailError);
      }

      return res.status(200).json({ success: true, routedTo: 'Personal PayPal Secure' });
    }

    res.status(400).json({ received: true });
  });

  return router;
};
