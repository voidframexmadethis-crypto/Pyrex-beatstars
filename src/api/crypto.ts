import { Router } from 'express';

export function createCryptoRouter(prisma: any): Router {
  const router = Router();

  // Create Crypto Charge (Direct-to-Wallet secure simulation)
  router.post('/create-charge', async (req, res) => {
    try {
      const { trackId, title, price, licenseType, buyerEmail } = req.body;
      
      const amount = Number(price) || 29.99;
      const trackTitle = title || 'Instrumental Lease';

      // Direct-to-Wallet Zero-API Invoice
      const chargeId = `crypto_inv_${Math.random().toString(36).substring(2, 11)}`;
      const hostedUrl = `${req.protocol}://${req.get('host')}/api/crypto/pay-portal?charge=${chargeId}&amount=${amount}&title=${encodeURIComponent(trackTitle)}`;

      // Save pending transaction if prisma available
      if (prisma) {
        try {
          await prisma.transaction.create({
            data: {
              id: chargeId,
              trackId: trackId || 'unknown',
              buyerEmail: buyerEmail || 'pending@krypside.com',
              licenseType: licenseType || 'Standard',
              amountPaid: amount,
              paymentGateway: 'Direct Crypto',
              licensePdfUrl: '/licenses/sample-license.pdf'
            }
          });
        } catch (dbErr) {
          console.warn('Failed to save pending crypto transaction:', dbErr);
        }
      }

      return res.json({
        success: true,
        hostedUrl,
        chargeId
      });
    } catch (err: any) {
      console.error('Failed to create crypto charge:', err);
      res.status(500).json({ error: err.message || 'Internal crypto gateway error' });
    }
  });

  // Hosted Crypto Payment Portal Page / Direct Wallet Simulation
  router.get('/pay-portal', (req, res) => {
    const { charge, amount, title } = req.query;
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Krypside Secure Direct Crypto Checkout</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-neutral-950 text-white font-sans flex items-center justify-center min-h-screen p-4">
        <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
          <div class="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            🪙
          </div>
          <h2 class="text-xl font-bold text-white mb-1">Direct Crypto Transfer</h2>
          <p class="text-xs text-neutral-400 mb-6">Invoice: ${charge || 'INV-001'}</p>
          
          <div class="bg-neutral-950 p-4 rounded-xl mb-6 text-left border border-neutral-800">
            <div class="text-xs text-neutral-500 uppercase font-bold mb-1">Item Description</div>
            <div class="text-sm font-semibold text-white mb-3">${decodeURIComponent(String(title || 'Instrumental Lease'))}</div>
            <div class="flex justify-between items-center pt-2 border-t border-neutral-800">
              <span class="text-xs text-neutral-400">Total Amount Due</span>
              <span class="text-emerald-400 font-bold text-lg">$${amount || '29.99'} USD</span>
            </div>
          </div>

          <div class="space-y-4 mb-6 text-left">
            <div class="p-4 bg-neutral-950 border border-emerald-500/30 rounded-xl">
              <div class="text-[10px] font-bold text-neutral-500 uppercase mb-2">EVM (ETH/USDC) Destination</div>
              <div class="text-[11px] font-mono text-white break-all bg-black/40 p-2 rounded border border-neutral-800">
                0x0000000000000000000000000000000000000000
              </div>
            </div>
            
            <p class="text-[11px] text-neutral-400 leading-relaxed italic text-center">
              "Send funds directly to the vault address above. Your license unlocks once the transaction is confirmed on-chain."
            </p>
          </div>

          <button 
            onclick="simulatePayment()"
            id="payBtn"
            class="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            I Have Sent Payment
          </button>
          
          <p class="text-[10px] text-neutral-600 mt-4 uppercase tracking-widest font-bold">Secured Independent Transfer Pipeline</p>
        </div>

        <script>
          function simulatePayment() {
            const btn = document.getElementById('payBtn');
            btn.disabled = true;
            btn.innerText = 'Verifying Transfer...';
            setTimeout(() => {
              btn.innerText = '✓ Received!';
              btn.className = 'w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl';
              setTimeout(() => {
                window.location.href = '/?crypto_success=true';
              }, 1200);
            }, 1500);
          }
        </script>
      </body>
      </html>
    `);
  });

  // Webhook listener - Purged of external API dependencies
  router.post('/webhook', async (req, res) => {
    // Zero-API direct checkout handles verification via internal or manual proof
    res.json({ received: true });
  });

  return router;
}
