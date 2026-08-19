import React, { useMemo, useState } from 'react';
import { CheckCircle2, Download, FileText, Mail, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Beat } from '../types';
import { generateLicensePDF } from '../utils/contractGenerator';
import { generateISRC } from '../utils/isrc';
import { downloadTaggedM4A } from '../utils/m4aMetadata';

interface CheckoutReceiptProps {
  beat: Beat;
  licenseType: string;
  artistEmail: string;
  transactionId: string;
  onClose: () => void;
}

const CheckoutReceipt: React.FC<CheckoutReceiptProps> = ({ 
  beat, 
  licenseType, 
  artistEmail, 
  transactionId,
  onClose 
}) => {
  const [isTagging, setIsTagging] = useState(false);

  const isrc = useMemo(() => beat.isrcCode || generateISRC(beat.id), [beat.id, beat.isrcCode]);
  
  const handleDownloadLicense = () => {
    generateLicensePDF({
      beat,
      licenseName: licenseType,
      licensee: {
        fullName: 'Valued Customer',
        artistName: 'Artist',
        email: artistEmail
      },
      transactionId,
      purchaseDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    });
  };

  const handleDownloadBeat = async () => {
    const audioUrl = beat.untaggedM4aUrl || beat.audioUrl;
    if (audioUrl) {
      setIsTagging(true);
      try {
        await downloadTaggedM4A(audioUrl, beat, isrc);
      } finally {
        setIsTagging(false);
      }
    }
  };

  return (
    <div className="py-2 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <CheckCircle2 className="w-8 h-8" />
      </motion.div>

      <h2 className="text-xl font-black text-white mb-1 uppercase tracking-tight">Order Confirmed!</h2>
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
          ISRC: {isrc}
        </span>
      </div>

      <p className="text-neutral-400 text-xs leading-relaxed mb-6 px-4">
        Your transaction was successful. High-quality master files with embedded ISRC metadata and your legal contract are ready for immediate download.
      </p>

      <div className="grid grid-cols-1 gap-3 mb-6 px-2">
        <button
          onClick={handleDownloadBeat}
          disabled={isTagging}
          className="flex items-center justify-between w-full bg-white text-black p-4 rounded-xl font-bold text-sm hover:bg-neutral-200 transition-all group disabled:opacity-70"
        >
          <div className="flex items-center gap-3">
            {isTagging ? <Loader2 className="w-5 h-5 animate-spin text-neutral-600" /> : <Download className="w-5 h-5 text-neutral-600" />}
            <div className="text-left">
              <div className="leading-none">{isTagging ? 'Embedding Metadata...' : 'Download .m4a Master'}</div>
              <div className="text-[10px] text-neutral-500 mt-1 uppercase font-black tracking-widest">{beat.title}</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
        </button>

        <button
          onClick={handleDownloadLicense}
          className="flex items-center justify-between w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all group"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <div className="leading-none">Download Signed License</div>
              <div className="text-[10px] text-neutral-500 mt-1 uppercase font-black tracking-widest">PDF Agreement</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 px-2">
        <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-3 flex items-center gap-3 text-left">
          <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">Recipient</div>
            <div className="text-[10px] font-bold text-white truncate">{artistEmail}</div>
          </div>
        </div>
        <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-3 flex items-center gap-3 text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">Verified</div>
            <div className="text-[10px] font-bold text-white truncate">{transactionId.slice(0, 12)}</div>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="text-neutral-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
      >
        Return to Catalog
      </button>
    </div>
  );
};

export default CheckoutReceipt;
