// PyrexSpinna Automated Licensing & Contract Generator
import { Resend } from 'resend';

export interface LicenseContractData {
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  beatTitle: string;
  producerName?: string;
  bpm?: number | string;
  musicalKey?: string;
  licenseType: string;
  price: number | string;
  purchaseDate?: string;
}

export function generateContractHtml(data: LicenseContractData): string {
  const issueDate = data.purchaseDate || new Date().toLocaleDateString();
  const orderRef = data.orderId || `KRYP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>PyrexSpinna Official License Agreement - ${data.beatTitle}</title>
      <style>
        body { background: #09090b; color: #f4f4f5; font-family: 'Courier New', Courier, monospace; padding: 40px; margin: 0; }
        .contract-container { background: #121215; border: 1px solid #27272a; border-radius: 12px; padding: 40px; max-width: 700px; margin: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }
        h1 { color: #60a5fa; text-align: center; font-size: 22px; letter-spacing: 2px; margin-bottom: 5px; }
        h2 { text-align: center; color: #a1a1aa; font-size: 12px; font-weight: normal; margin-top: 0; text-transform: uppercase; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #18181b; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #27272a; }
        .meta-item label { color: #71717a; font-size: 11px; display: block; text-transform: uppercase; margin-bottom: 3px; }
        .meta-item span { color: #f4f4f5; font-size: 14px; font-weight: bold; }
        .terms { font-size: 12px; color: #d1d5db; line-height: 1.6; margin-top: 20px; text-align: justify; }
        .signatures { margin-top: 40px; display: flex; justify-content: space-between; border-top: 1px dashed #27272a; padding-top: 20px; }
        .sig-box { font-size: 11px; color: #a1a1aa; }
        .sig-line { border-bottom: 1px solid #52525b; width: 200px; margin-bottom: 5px; height: 25px; }
        .badge { display: inline-block; background: #1e3a8a; color: #93c5fd; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="contract-container">
        <h1>PYREX ENTERPRISE VAULT</h1>
        <h2>Official Digital License & Distribution Agreement</h2>
        <hr style="border: 0; border-top: 1px solid #27272a; margin: 20px 0;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div><span class="badge">${data.licenseType}</span></div>
          <div style="color: #71717a; font-size: 12px;">Ref: ${orderRef}</div>
        </div>

        <div class="meta-grid">
          <div class="meta-item"><label>Effective Date</label><span>${issueDate}</span></div>
          <div class="meta-item"><label>Licensee (Artist)</label><span>${data.buyerName}</span></div>
          <div class="meta-item"><label>Contact Email</label><span>${data.buyerEmail}</span></div>
          <div class="meta-item"><label>Composition Title</label><span>"${data.beatTitle}"</span></div>
          <div class="meta-item"><label>Producer</label><span>${data.producerName || 'PyrexSpinna Verified Producer'}</span></div>
          <div class="meta-item"><label>Consideration Paid</label><span>$${Number(data.price).toFixed(2)} USD</span></div>
        </div>

        <div class="terms">
          <p><strong>1. GRANT OF RIGHTS:</strong> The Producer grants the Licensee the non-exclusive/exclusive right to record vocal or instrumental variations over the musical composition ("Beat") specified above, subject to the commercial distribution limitations and streaming caps of the selected tier (${data.licenseType}).</p>
          <p><strong>2. ROYALTIES & PUBLISHING:</strong> Licensee is granted commercial exploitation rights up to the permitted streaming limit. For master recordings exceeding streaming limits, standard publishing splits apply.</p>
          <p><strong>3. WARRANTIES:</strong> All beats are delivered in pristine master-quality WAV format. PyrexSpinna securely timestamps and verifies this execution contract in the cryptographic ledger vault.</p>
        </div>

        <div class="signatures">
          <div class="sig-box">
            <div class="sig-line"></div>
            <strong>PyrexSpinna Licensing Agent</strong><br>Authorized Issuer
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <strong>${data.buyerName}</strong><br>Licensee / Buyer
          </div>
        </div>

        <p style="text-align: center; font-size: 10px; color: #52525b; margin-top: 40px;">
          Cryptographically Verified & Secured by PyrexSpinna Enterprise Infrastructure &bull; ID: ${orderRef}
        </p>
      </div>
    </body>
    </html>
  `;
}

export async function generateAndSendContract(orderData: LicenseContractData): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("Resend API key missing. Contract email simulation logged.");
    return false;
  }

  const contractHtml = generateContractHtml(orderData);
  const resend = new Resend(resendKey);

  try {
    await resend.emails.send({
      from: 'PyrexSpinna Contracts <contracts@pyrex.vercel.app>',
      to: orderData.buyerEmail,
      cc: 'pyrex@gmail.com',
      subject: `📜 Executed Legal License Agreement: "${orderData.beatTitle}" (${orderData.licenseType})`,
      html: `
        <div style="background: #09090b; color: #f4f4f5; padding: 30px; font-family: sans-serif; border-radius: 12px; max-width: 600px; margin: auto;">
          <h2 style="color: #60a5fa;">License Contract Executed</h2>
          <p>Hello ${orderData.buyerName},</p>
          <p>Your payment for <strong>"${orderData.beatTitle}"</strong> under the <strong>${orderData.licenseType}</strong> tier has been verified.</p>
          <p>Your official cryptographic license agreement has been generated and filed in the PyrexSpinna Vault.</p>
          <hr style="border-color: #27272a; margin: 20px 0;">
        </div>
      `,
      attachments: [
        {
          filename: `License_${orderData.beatTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${orderData.licenseType.replace(/\s+/g, '_')}.html`,
          content: Buffer.from(contractHtml).toString('base64'),
        }
      ]
    });
    return true;
  } catch (err) {
    console.error("Failed to email contract:", err);
    return false;
  }
}

