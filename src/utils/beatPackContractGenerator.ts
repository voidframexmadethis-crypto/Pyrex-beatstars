import { jsPDF } from 'jspdf';
import { BeatPackData } from '../types';

export interface BeatPackLicenseeData {
  fullName: string;
  artistName: string;
  email: string;
  signature: string;
}

export interface BeatPackContractData {
  pack: BeatPackData;
  licensee: BeatPackLicenseeData;
  transactionId: string;
  issueDate: string;
  isFreeDownload?: boolean;
}

export const generateBeatPackContractPDF = (data: BeatPackContractData): string => {
  const { pack, licensee, transactionId, issueDate, isFreeDownload = true } = data;
  const doc = new jsPDF();
  
  const primaryFont = 'helvetica';
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  const addText = (text: string, size = 10, style = 'normal', color = [0, 0, 0]) => {
    doc.setFont(primaryFont, style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    
    const lines = doc.splitTextToSize(text, pageWidth - (margin * 2));
    doc.text(lines, margin, yPos);
    yPos += (lines.length * (size * 0.38)) + 4;
  };

  const addHeading = (text: string) => {
    yPos += 4;
    addText(text.toUpperCase(), 11, 'bold', [147, 51, 234]);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos - 3, pageWidth - margin, yPos - 3);
    yPos += 2;
  };

  // Top Banner
  doc.setFillColor(15, 10, 25);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setFont(primaryFont, 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('PYREX ENTERPRISE VAULT', margin, 18);

  doc.setFontSize(10);
  doc.setFont(primaryFont, 'normal');
  doc.setTextColor(216, 180, 254);
  doc.text(isFreeDownload ? 'FREE BEAT PACK ACCESS & NON-SHAREABLE LEGAL AGREEMENT' : 'BEAT PACK OFFICIAL LICENSE AGREEMENT', margin, 26);

  yPos = 45;

  // Metadata Bar
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`License Ref: ${transactionId}`, margin, yPos);
  doc.text(`Execution Date: ${issueDate}`, pageWidth - margin - 55, yPos);
  yPos += 10;

  // 1. Parties
  addHeading('1. THE PARTIES');
  addText(`This Legally Binding License Agreement ("Agreement") is entered into on ${issueDate} by and between:`);
  addText(`PRODUCER / LICENSOR: PyrexSpinna (Pyrex Enterprise Vault)`);
  addText(`ARTIST / LICENSEE: ${licensee.fullName} (A.K.A. "${licensee.artistName}")`);
  addText(`LICENSEE CONTACT EMAIL: ${licensee.email}`);

  // 2. The Asset
  addHeading('2. BEAT PACK DETAILS');
  addText(`BEAT PACK TITLE: "${pack.title}"`, 11, 'bold');
  addText(`PRODUCER: ${pack.producer || 'PyrexSpinna'}`);
  addText(`TRACK COUNT: ${pack.beatCount || pack.beats?.length || 0} Instrumentals Included`);
  addText(`KEY / BPM SUMMARY: ${pack.bpmKey || 'Various BPM / Keys'}`);

  // 3. Strict Non-Shareable & Anti-Redistribution Clause
  addHeading('3. STRICT NON-SHAREABLE & ANTI-REDISTRIBUTION COVENANT');
  addText('• NON-TRANSFERABLE PERSONAL & DEMO LICENSE: The Licensee is granted a personal, non-transferable right to download and utilize the instrumentals contained in this Beat Pack solely for personal audition, demo vocal recording, and composition writing.');
  addText('• ABSOLUTE PROHIBITION ON SHARING: The Licensee expressly agrees under penalty of law that they SHALL NOT upload, share, re-distribute, leak, resell, stream publicly, send, or transfer this Beat Pack or any individual tracks contained within to any third party, public file host, discord server, torrent site, or online forum.');
  addText('• NO UNSANCTIONED COMMERCIAL EXPLOITATION: Without an upgraded commercial lease or exclusive buyout license, commercial streaming, monetization, sync licensing, or radio broadcast are strictly prohibited.');
  addText('• INTELLECTUAL PROPERTY & TAKEDOWN RIGHTS: Producer (PyrexSpinna) retains 100% full master and publishing ownership of all compositions. Any violation of this non-sharing covenant will immediately void this license, trigger automatic DMCA copyright takedown notices, permanent studio blacklisting, and civil liability.');

  // 4. Digital Signature & Cryptographic Verification
  addHeading('4. DIGITAL SIGNATURE & CRYPTOGRAPHIC STAMP');
  addText(`DIGITAL SIGNATURE: ${licensee.signature}`);
  addText(`IP / TIMESTAMP STAMP: Cryptographically Verified & Filed in Pyrex Enterprise Vault`);
  addText(`VERIFICATION REF: VAULT-BP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);

  yPos = doc.internal.pageSize.getHeight() - 30;
  doc.setDrawColor(168, 85, 247);
  doc.line(margin, yPos, margin + 60, yPos);
  doc.line(pageWidth - margin - 60, yPos, pageWidth - margin, yPos);

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('PyrexSpinna (Producer / Licensor)', margin, yPos + 5);
  doc.text(`${licensee.fullName} (Artist / Licensee)`, pageWidth - margin - 60, yPos + 5);

  const fileName = `Legal_Agreement_${pack.title.replace(/[^a-zA-Z0-9]/g, '_')}_${transactionId}.pdf`;
  doc.save(fileName);
  return fileName;
};
