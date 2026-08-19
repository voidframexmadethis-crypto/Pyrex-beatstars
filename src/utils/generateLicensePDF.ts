import { jsPDF } from 'jspdf';

export interface LicenseData {
  artistName: string;
  beatTitle: string;
  licenseType: string;
  transactionId: string;
  date?: string;
}

export const generateLicensePDF = ({ artistName, beatTitle, licenseType, transactionId, date }: LicenseData) => {
  const doc = new jsPDF();
  const currentDate = date || new Date().toLocaleDateString();

  // Primary Theme Colors (PyrexSpinna Purple & Dark Accents)
  doc.setFillColor(15, 10, 25);
  doc.rect(0, 0, 210, 40, 'F');

  // Header Title
  doc.setTextColor(168, 85, 247); // #a855f7
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('PYREX SPINNA MUSIC GROUP', 14, 25);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('OFFICIAL BEAT LICENSE AGREEMENT', 14, 33);

  // Contract Details Body
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  doc.text(`Transaction ID: ${transactionId}`, 14, 55);
  doc.text(`Effective Date: ${currentDate}`, 14, 63);
  doc.text(`Licensor (Producer): PyrexSpinna`, 14, 71);
  doc.text(`Licensee (Artist): ${artistName}`, 14, 79);
  doc.text(`Track Title: "${beatTitle}"`, 14, 87);
  doc.text(`License Type: ${licenseType}`, 14, 95);

  // Terms Section
  doc.setLineWidth(0.5);
  doc.setDrawColor(168, 85, 247);
  doc.line(14, 102, 196, 102);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TERMS & CONDITIONS', 14, 112);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const termsText = [
    `1. GRANT OF LICENSE: PyrexSpinna hereby grants ${artistName} a non-exclusive license for commercial recording and distribution of the track titled "${beatTitle}".`,
    `2. STREAMING & SALES LIMITS: This ${licenseType} permits up to 500,000 audio streams across Spotify, Apple Music, and audio platforms.`,
    `3. CREDIT REQUIREMENT: Licensee must credit (Prod. PyrexSpinna) in all digital distribution metadata and video descriptions.`,
    `4. OWNERSHIP: The original copyright, audio compositions, and master sound recording remain 100% owned by PyrexSpinna.`,
    `5. ROYALTIES: Licensee retains 100% of master royalties until streaming limits are exceeded, after which renewal or exclusive upgrade is required.`,
  ];

  let yPosition = 122;
  termsText.forEach((paragraph) => {
    const splitLines = doc.splitTextToSize(paragraph, 180);
    doc.text(splitLines, 14, yPosition);
    yPosition += splitLines.length * 7 + 4;
  });

  // Digital Signature Seal
  doc.setDrawColor(200, 200, 200);
  doc.rect(14, yPosition + 10, 80, 25);
  doc.setFontSize(8);
  doc.text('AUTHORIZED DIGITAL SIGNATURE', 18, yPosition + 18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(168, 85, 247);
  doc.text('PYREX SPINNA (STAMPED)', 18, yPosition + 28);

  // Auto Download Trigger
  doc.save(`${beatTitle.replace(/\s+/g, '_')}_License_Agreement.pdf`);
};
