import { jsPDF } from 'jspdf';
import { Beat, License } from '../types';

interface LicenseeData {
  fullName: string;
  artistName: string;
  email: string;
}

interface ContractData {
  beat: Beat;
  licenseName: string;
  streamsLimit?: string | number;
  licensee: LicenseeData;
  transactionId: string;
  purchaseDate: string;
}

export const generateLicensePDF = (data: ContractData) => {
  const { beat, licenseName, streamsLimit, licensee, transactionId, purchaseDate } = data;
  const doc = new jsPDF();
  
  // Font Settings
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
    yPos += (lines.length * (size * 0.4)) + 5;
  };

  const addHeading = (text: string) => {
    yPos += 5;
    addText(text.toUpperCase(), 12, 'bold', [0, 0, 0]);
    doc.line(margin, yPos - 3, pageWidth - margin, yPos - 3);
    yPos += 2;
  };

  // Header
  doc.setFont(primaryFont, 'bold');
  doc.setFontSize(22);
  doc.text('LICENSE AGREEMENT', margin, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont(primaryFont, 'normal');
  doc.text(`Transaction ID: ${transactionId}`, margin, yPos);
  doc.text(`Date: ${purchaseDate}`, pageWidth - margin - 60, yPos);
  yPos += 15;

  // Parties
  addHeading('1. THE PARTIES');
  addText(`This License Agreement ("Agreement") is entered into on ${purchaseDate} by and between:`);
  addText(`LICENSOR: Pyrex spinna (hereinafter referred to as the "Producer")`);
  addText(`LICENSEE: ${licensee.fullName} a.k.a ${licensee.artistName} (${licensee.email}) (hereinafter referred to as the "Artist")`);

  // The Asset
  addHeading('2. THE MASTER');
  addText(`The Producer grants the Artist a license to the musical composition titled:`);
  addText(`TITLE: ${beat.title}`, 11, 'bold');
  addText(`FORMAT: Pristine High-Quality Master File (.m4a)`);

  // License Type & Usage
  addHeading(`3. ${licenseName.toUpperCase()} LICENSE TERMS`);
  
  const isExclusive = licenseName.toLowerCase().includes('exclusive');
  const isUnlimited = licenseName.toLowerCase().includes('unlimited');

  if (isExclusive) {
    addText('• EXCLUSIVE RIGHTS: The Artist is granted exclusive ownership of the Master recording. The Producer shall not license this work to any third party hereafter.');
    addText('• BUYOUT: This is a full master buyout license.');
    addText('• USAGE: Unlimited commercial recordings, unlimited streams, and unlimited broadcast rights.');
  } else {
    addText('• NON-EXCLUSIVE: This is a non-exclusive license. The Producer maintains the right to license the Master to other third parties.');
    const limit = isUnlimited ? 'Unlimited' : (streamsLimit || '50,000');
    addText(`• STREAMING LIMIT: The Artist is permitted up to ${limit} streams on digital platforms.`);
    addText(`• BROADCAST: ${isUnlimited ? 'Unlimited' : 'Limited'} synchronization and broadcast rights.`);
  }

  // Publishing & Splits
  addHeading('4. PUBLISHING & SPLIT SHEET');
  addText('Regardless of the license tier, the following Composition Ownership Splits apply for registration with Performance Rights Organizations (PROs) and Distributors:');
  
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPos, pageWidth - (margin * 2), 30, 'F');
  yPos += 5;
  addText(`• PYREX SPINNA (Producer): 50% Writer/Composer Share`, 10, 'bold');
  addText(`• ${licensee.artistName.toUpperCase()} (Songwriter): 50% Writer/Lyricist Share`, 10, 'bold');
  yPos += 5;

  addText('The Artist agrees to register the track with their respective PRO (ASCAP/BMI/PRS) and Distributor (Believe/Sony/DistroKid) accurately reflecting these splits.');

  // Royalties
  addHeading('5. MECHANICAL ROYALTIES');
  addText('The Artist shall retain 100% of the net artist royalties from the sales and streams of the new song, subject to the composition splits mentioned in Section 4.');

  // Signatures
  yPos = doc.internal.pageSize.getHeight() - 40;
  doc.line(margin, yPos, margin + 60, yPos);
  doc.line(pageWidth - margin - 60, yPos, pageWidth - margin, yPos);
  
  doc.setFontSize(8);
  doc.text('Pyrex spinna (Producer)', margin, yPos + 5);
  doc.text(`${licensee.fullName} (Artist)`, pageWidth - margin - 60, yPos + 5);

  // Download
  const fileName = `License_${beat.title.replace(/\s+/g, '_')}_${transactionId}.pdf`;
  doc.save(fileName);
};

export const generateAndDownloadLicense = (beatName: string, userName: string) => {
  const doc = new jsPDF();
  const currentDate = new Date().toLocaleDateString();

  // Document Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Exclusive Beat License Agreement", 20, 20);

  // Metadata Header
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Licensed Beat: ${beatName}`, 20, 30);
  doc.text(`Licensee (User): ${userName || 'Valued Fan'}`, 20, 36);
  doc.text(`Effective Date: ${currentDate}`, 20, 42);

  // 1. Grant of License
  doc.setFont("helvetica", "bold");
  doc.text("1. Grant of License", 20, 54);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Subject to the terms and conditions of this Agreement, the Producer grants\n" +
    "the Licensee a non-exclusive, non-transferable license to use the provided\n" +
    "audio beats ('Licensed Materials') for personal, non-commercial use only,\n" +
    "specifically for rapping or vocal performance over the beats.",
    20, 60, { maxWidth: 170 }
  );

  // 2. Restrictions (Protecting your beats from being shared or used by others)
  doc.setFont("helvetica", "bold");
  doc.text("2. Restrictions", 20, 88);
  doc.setFont("helvetica", "normal");
  doc.text(
    "The Licensee shall not:\n" +
    "• Share, distribute, sell, or lease the Licensed Materials to any third party.\n" +
    "• Allow any third party to perform or record over the Licensed Materials,\n" +
    "  including friends, family members, or collaborators.\n" +
    "• Use the Licensed Materials for any commercial purpose without obtaining\n" +
    "  a separate commercial license.\n" +
    "• Modify, remix, or create derivative works of the Licensed Materials,\n" +
    "  except for the addition of vocal recordings.",
    20, 94, { maxWidth: 170 }
  );

  // 3. Ownership
  doc.setFont("helvetica", "bold");
  doc.text("3. Ownership", 20, 142);
  doc.setFont("helvetica", "normal");
  doc.text(
    "The Producer retains full ownership, copyright, and title to the Licensed Materials.\n" +
    "Nothing in this Agreement shall be construed as a transfer of ownership or copyright\n" +
    "to the Licensee.",
    20, 148, { maxWidth: 170 }
  );

  // 4. Term
  doc.setFont("helvetica", "bold");
  doc.text("4. Term", 20, 170);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This Agreement is effective upon the download of the Licensed Materials and shall\n" +
    "remain in effect until terminated by the Producer for any breach of this Agreement.",
    20, 176, { maxWidth: 170 }
  );

  // 5. Governing Law
  doc.setFont("helvetica", "bold");
  doc.text("5. Governing Law", 20, 196);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This Agreement shall be governed by and construed in accordance with the laws\n" +
    "of the Producer's jurisdiction.",
    20, 202, { maxWidth: 170 }
  );

  // Trigger browser download for the PDF
  doc.save(`${beatName.replace(/\s+/g, '_')}_License.pdf`);
};

export const handleFreeDownloadClick = (beat: any, userName: string) => {
  // 1. Trigger audio file download
  if (beat.audioUrl) {
    const audioLink = document.createElement('a');
    audioLink.href = beat.audioUrl;
    audioLink.download = `${beat.name || beat.title || 'Beat'}.m4a`;
    audioLink.click();
  }

  // 2. Automatically generate and download the legal contract PDF
  generateAndDownloadLicense(beat.name || beat.title || 'Beat', userName);
};
