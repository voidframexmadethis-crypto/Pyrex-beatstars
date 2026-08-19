import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingStep: number;
  userAvailableTokens: number;
  isReloaded: boolean;
  loadFunnelStep: (step: number) => void;
  setUserAvailableTokens: (tokens: number) => void;
  setIsReloaded: (reloaded: boolean) => void;
  setBookingLinks: (links: string) => void;
  bookingLinks: string;
  setBookingBpm: (bpm: string) => void;
  bookingBpm: string;
  setBookingScope: (scope: string) => void;
  bookingScope: string;
  setContractSig: (sig: string) => void;
  contractSig: string;
  contractCheck: boolean;
  setContractCheck: (check: boolean) => void;
  handleBookingSubmit: (e: React.FormEvent) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  bookingStep,
  userAvailableTokens,
  isReloaded,
  loadFunnelStep,
  setUserAvailableTokens,
  setIsReloaded,
  setBookingLinks,
  bookingLinks,
  setBookingBpm,
  bookingBpm,
  setBookingScope,
  bookingScope,
  setContractSig,
  contractSig,
  contractCheck,
  setContractCheck,
  handleBookingSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[999999] flex items-center justify-center font-sans">
      <div className="bg-[#18181c] border-2 border-[#FFC439] rounded-2xl w-[440px] max-h-[90vh] overflow-y-auto p-[35px] text-white shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative">
        {bookingStep === 1 && (
          <div id="paywall-step">
            <div className="bg-[#191922] p-5 border-b border-[#242432] flex items-center justify-between rounded-t-lg -m-[35px] mb-5">
              <div>
                <h4 className="m-0 text-sm text-[#ff4a4a]">⚠️ 0 REQUEST TOKENS REMAINING</h4>
                <p className="mt-1 text-xs text-[#9292a6]">Buy an additional request slot to change your beat path</p>
              </div>
              <span className="text-lg font-bold text-[#ff4a4a]">$69.55</span>
            </div>
            
            <p className="text-xs text-[#9292a6] leading-relaxed mb-5">
              Your first initial custom beat request has already been used. To unlock a brand new project revision slot, clear the PayPal processing gateway fee below.
            </p>

            <div className="bg-[#191922] rounded-lg p-4 mb-6 border border-[#242432]">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#9292a6]">Additional Production Token</span>
                <span className="font-semibold">$69.55</span>
              </div>
              <div className="flex justify-between text-xs mb-3 pb-3 border-b border-[#242432]">
                <span className="text-[#9292a6]">Processing Fees / VAT</span>
                <span className="text-[#00e676] font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Total Due Today:</span>
                <span className="text-[#00e676] text-base">$69.55</span>
              </div>
            </div>

            <div className="mb-4 relative z-10">
              <PayPalScriptProvider options={{ clientId: "test", currency: "USD" }}>
                <PayPalButtons 
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [{
                        amount: { value: '69.55', currency_code: 'USD' },
                        description: "Additional Custom Beat Request Token Reload"
                      }]
                    });
                  }}
                  onApprove={async (data, actions) => {
                    if (actions.order) {
                      await actions.order.capture();
                      setUserAvailableTokens(1);
                      setIsReloaded(true);
                      loadFunnelStep(2);
                    }
                  }}
                  onError={(err) => {
                    console.error("PayPal Processing Halted: ", err);
                    alert("Checkout initialization encountered a localized network bottleneck.");
                  }}
                  style={{ layout: 'vertical', color: 'gold', shape: 'pill', label: 'checkout' }}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        )}

        {bookingStep === 2 && (
          <div id="message-wall-step">
            <div className="flex justify-between items-center mb-4">
              <h3 className="m-0 text-[#00e676] text-xl">🔓 Message Wall Active</h3>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isReloaded ? 'bg-[#FFC439] text-[#111]' : (userAvailableTokens > 0 ? 'bg-[#00e676] text-[#111]' : 'bg-[#FFC439] text-[#111]')}`}>
                {isReloaded ? 'RELOADED CREDIT UNLOCKED' : (userAvailableTokens > 0 ? `${userAvailableTokens} REQUEST AVAILABLE` : '0 REQUEST TOKENS REMAINING')}
              </span>
            </div>
            
            <form onSubmit={handleBookingSubmit}>
              <label className="block mb-1.5 text-xs text-[#aaa]">Reference Track URL:</label>
              <input 
                type="url" 
                value={bookingLinks}
                onChange={(e) => setBookingLinks(e.target.value)}
                placeholder="YouTube or Spotify link" 
                required 
                className="w-full p-3 bg-[#252529] border border-[#3f3f46] rounded-lg text-white mb-4 text-xs" 
              />

              <label className="block mb-1.5 text-xs text-[#aaa]">Target BPM:</label>
              <input 
                type="text" 
                value={bookingBpm}
                onChange={(e) => setBookingBpm(e.target.value)}
                placeholder="e.g., 140" 
                required 
                className="w-full p-3 bg-[#252529] border border-[#3f3f46] rounded-lg text-white mb-4 text-xs" 
              />

              <label className="block mb-1.5 text-xs text-[#aaa]">What do you want changed or created? (Details):</label>
              <textarea 
                value={bookingScope}
                onChange={(e) => setBookingScope(e.target.value)}
                placeholder="Be descriptive..." 
                rows={3} 
                required 
                className="w-full p-3 bg-[#252529] border border-[#3f3f46] rounded-lg text-white mb-5 resize-none text-xs leading-relaxed" 
              ></textarea>

              <label className="block mb-1.5 text-xs text-[#FFC439] font-bold">📝 Mandatory Production Agreement:</label>
              <div className="bg-[#111116] border border-[#3f3f46] rounded-lg p-3 h-28 overflow-y-auto text-[10px] text-[#ccc] leading-relaxed mb-4 font-mono">
                <strong>SECTION 1: EXCLUSIVE PRIVACY CLAUSE</strong><br/>
                Upon delivery of the custom audio track file, the purchasing Client is strictly prohibited from sharing, copying, leaking, sending, or distributing the audio source data...
              </div>

              <div className="bg-[#191922] p-3 rounded-lg border border-[#242432] mb-5">
                <label className="flex items-start gap-2 text-xs text-white cursor-pointer mb-2">
                  <input type="checkbox" className="mt-0.5" required checked={contractCheck} onChange={(e) => setContractCheck(e.target.checked)} />
                  <span>I agree to the privacy restrictions...</span>
                </label>
                <input type="text" placeholder="Type Full Legal Name to Sign" required className="w-full p-2 bg-[#252529] border border-[#3f3f46] rounded text-white text-xs" value={contractSig} onChange={(e) => setContractSig(e.target.value)} />
              </div>

              <button type="submit" className="w-full bg-[#4e73df] text-white p-3 rounded-lg font-bold text-sm hover:bg-[#3b5998]">
                Sign & Send Request Elements
              </button>
            </form>
          </div>
        )}

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-transparent border-none text-[#ff4a4a] text-2xl font-bold hover:text-red-400"
        >
          &times;
        </button>
      </div>
    </div>
  );
};
