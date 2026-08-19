import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Beat } from '../types';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import CheckoutReceipt from './CheckoutReceipt';
import { CryptoPaymentSection } from './CryptoPaymentSection';

interface CheckoutModalProps {
  beat: Beat | null;
  onClose: () => void;
  onSuccess: (beat: Beat) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ beat, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'1tap' | 'paypal' | 'crypto'>('1tap');
  const [licenseType, setLicenseType] = useState<string>('WAV Lease');
  const [artistName, setArtistName] = useState('');
  const [artistEmail, setArtistEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { state } = useStore();
  const config = state.profile.marketingConfig;

  const licensePrices: Record<string, number> = {
    'MP3 Lease': beat?.licenses?.mp3Lease?.price ?? config?.defaultMp3Price ?? 0,
    'WAV Lease': beat?.licenses?.wavLease?.price ?? config?.defaultWavPrice ?? 0,
    'Trackout Stems': beat?.licenses?.premiumLease?.price ?? config?.defaultStemsPrice ?? 0,
    'Exclusive Rights': beat?.licenses?.exclusive?.price ?? config?.defaultExclusivePrice ?? 0,
  };

  // If beat has a customPrice, use it as the finalPrice, otherwise fallback to license/standard logic
  const finalPrice = (beat as any)?.customPrice ?? licensePrices[licenseType] ?? beat?.price ?? config?.defaultMp3Price ?? 0;
  const trackTitle = beat?.title || "Premium Instrumental Lease";

  const [isPayPalSuccess, setIsPayPalSuccess] = useState(false);
  const [isOneTapSuccess, setIsOneTapSuccess] = useState(false);
  const [lastTransactionId, setLastTransactionId] = useState('');
  
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const isRenderingRef = useRef(false);

  const handle1TapCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistEmail || !artistName) {
      setErrorMessage('Please enter your Stage Name and Email for license delivery.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beatId: beat?.id,
          beatTitle: trackTitle,
          licenseType,
          amount: finalPrice,
          artistName,
          artistEmail,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setLastTransactionId(data.transactionId || `TAP-${Date.now()}`);
        setIsOneTapSuccess(true);
        if (beat) {
          onSuccess({
            ...beat,
            price: finalPrice,
          });
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage('Payment initialization failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 1. Script Loading Effect
  useEffect(() => {
    if (activeTab !== 'paypal') return;

    const scriptId = 'paypal-sdk-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=sb&currency=USD`;
      script.async = true;
      
      script.onload = () => setIsSdkLoaded(true);
      script.onerror = () => setErrorMessage('Failed to connect to the banking network.');
      document.body.appendChild(script);
    } else if ((window as any).paypal) {
      setIsSdkLoaded(true);
    }
  }, [activeTab]);

  // 2. Button Rendering Effect
  useEffect(() => {
    if (activeTab !== 'paypal' || !isSdkLoaded || !beat || isRenderingRef.current) return;

    const paypal = (window as any).paypal;
    if (paypal && paypalContainerRef.current) {
      isRenderingRef.current = true;
      paypalContainerRef.current.innerHTML = '';

      try {
        paypal.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'checkout' },
          createOrder: (_data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: `Krypside Beat Track: ${trackTitle} (${licenseType})`,
                amount: { currency_code: 'USD', value: finalPrice.toString() }
              }]
            });
          },
          onApprove: async (_data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              setLastTransactionId(details.id || `PAY-${Date.now()}`);
              setArtistEmail(details.payer.email_address || artistEmail);
              setIsPayPalSuccess(true);
              if (beat) onSuccess(beat);
            });
          },
          onError: (err: any) => {
            console.error('PayPal Buttons Error:', err);
            setErrorMessage('Transaction blocked. Please test outside the editor frame.');
            isRenderingRef.current = false;
          }
        }).render(paypalContainerRef.current)
          .then(() => {
            isRenderingRef.current = false;
          })
          .catch((err: any) => {
            console.error('PayPal Render Error:', err);
            isRenderingRef.current = false;
          });
      } catch (err) {
        console.error('PayPal Setup Exception:', err);
        isRenderingRef.current = false;
      }
    }
  }, [isSdkLoaded, activeTab, finalPrice, trackTitle, licenseType, beat, onSuccess, onClose]);

  if (!beat) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-5 transition-all duration-300 ease-out overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-lg w-full overflow-hidden my-auto max-h-[90vh] overflow-y-auto"
      >
        
        {/* Header Layout */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-purple-400 uppercase tracking-wider m-0">
            SECURE CHECKOUT TERMINAL
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-none border-none text-neutral-500 hover:text-white text-2xl cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Item Summary Card */}
        <div className="bg-slate-950 p-3 px-4 rounded-xl mb-4 flex justify-between items-center border border-slate-800/50">
          <div>
            <div className="text-neutral-400 text-xs uppercase tracking-wider font-semibold">Instrumental Lease</div>
            <div className="text-white font-bold text-sm">"{trackTitle}"</div>
          </div>
          <div className="text-right">
            <div className="text-emerald-400 font-bold text-lg">${finalPrice}</div>
            <div className="text-[10px] text-purple-400">{licenseType}</div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="grid grid-cols-3 gap-1.5 mb-5 border-b border-slate-800 pb-3">
          <button 
            type="button"
            onClick={() => { setActiveTab('1tap'); setErrorMessage(''); }}
            className={`p-2 rounded-lg border-none cursor-pointer font-bold text-[11px] transition-all ${
              activeTab === '1tap' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-neutral-400 hover:bg-slate-700'
            }`}
          >
            ⚡ 1-Tap
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('paypal'); setErrorMessage(''); }}
            className={`p-2 rounded-lg border-none cursor-pointer font-bold text-[11px] transition-all ${
              activeTab === 'paypal' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-neutral-400 hover:bg-slate-700'
            }`}
          >
            💳 PayPal
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('crypto'); setErrorMessage(''); }}
            className={`p-2 rounded-lg border-none cursor-pointer font-bold text-[11px] transition-all ${
              activeTab === 'crypto' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-neutral-400 hover:bg-slate-700'
            }`}
          >
            💎 Crypto
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-xs text-center">
            {errorMessage}
          </div>
        )}

        {/* TAB 1: 1-TAP CHECKOUT (Stripe / Apple Pay / Google Pay enabled) */}
        {activeTab === '1tap' && (
          !isOneTapSuccess ? (
            <form onSubmit={handle1TapCheckout} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Select License Tier</label>
                <select 
                  value={licenseType} 
                  onChange={(e) => setLicenseType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {Object.keys(licensePrices).map((tier) => (
                    <option key={tier} value={tier}>
                      {tier} — ${licensePrices[tier]} USD
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Artist / Stage Name (for License Agreement)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Young Lilac" 
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Email Address (for Instant Delivery)</label>
                <input 
                  type="email" 
                  placeholder="artist@gmail.com" 
                  value={artistEmail}
                  onChange={(e) => setArtistEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-none rounded-full p-4 font-bold text-sm cursor-pointer transition-all shadow-lg shadow-purple-600/30 mt-2 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Secure Checkout...</span>
                  </>
                ) : (
                  <>
                    <span>⚡ Pay ${finalPrice} with 1-Tap (Apple Pay / GPay)</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <CheckoutReceipt 
              beat={beat!}
              licenseType={licenseType}
              artistEmail={artistEmail}
              transactionId={lastTransactionId}
              onClose={onClose}
            />
          )
        )}

        {/* TAB 2: LIVE PAYPAL / DEBIT CARD TERMINAL */}
        {activeTab === 'paypal' && (
          !isPayPalSuccess ? (
            <div className="min-h-[180px] flex flex-col justify-center gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Select License Tier</label>
                <select 
                  value={licenseType} 
                  onChange={(e) => setLicenseType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {Object.keys(licensePrices).map((tier) => (
                    <option key={tier} value={tier}>
                      {tier} — ${licensePrices[tier]} USD
                    </option>
                  ))}
                </select>
              </div>
              {!isSdkLoaded && !errorMessage && (
                <div className="text-center text-indigo-400 font-bold text-sm py-4 animate-pulse">
                  🔒 ESTABLISHING SECURE BANKING ENCRYPTION LINK...
                </div>
              )}
              <div ref={paypalContainerRef} className="w-full"></div>
            </div>
          ) : (
            <CheckoutReceipt 
              beat={beat!}
              licenseType={licenseType}
              artistEmail={artistEmail}
              transactionId={lastTransactionId}
              onClose={onClose}
            />
          )
        )}

        {/* TAB 3: DIRECT ZERO-API CRYPTO TRANSFER */}
        {activeTab === 'crypto' && (
          <CryptoPaymentSection address="0xe77A1B1372E8614Fa48Bf448e2DD80b9A60A9DaF" />
        )}
        {/* TAB 4: CASH APP DIRECT DEPOSIT MODAL */}

        <div className="mt-6 text-center text-[10px] text-neutral-600 uppercase tracking-widest font-medium">
          Encrypted SSL Secure Framework • Independent Krypside Enterprise Pipeline
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CheckoutModal;

