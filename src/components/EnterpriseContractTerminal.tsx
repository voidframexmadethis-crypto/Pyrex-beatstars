import React, { useState } from 'react';

export function EnterpriseContractTerminal() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-950 border border-blue-900/50 rounded-2xl p-6 text-white shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-black tracking-wide text-blue-400">LABEL & EXECUTIVE BRIEF PORTAL</h4>
          <p className="text-xs text-gray-400 mt-1">Direct synchronization and exclusive catalog buyout submission for verified A&Rs.</p>
        </div>
        <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-mono">
          SECURE ENCLAVE
        </span>
      </div>

      {submitted ? (
        <div className="bg-blue-950/40 border border-blue-500/40 rounded-xl p-6 text-center space-y-2">
          <h5 className="font-bold text-blue-400">Brief Dispatched Successfully</h5>
          <p className="text-xs text-gray-300">Your proposal has been routed directly to the producer's priority queue.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">LABEL / ORGANIZATION</label>
              <input required type="text" placeholder="e.g., Interscope / Epic" className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">EXECUTIVE CONTACT</label>
              <input required type="email" placeholder="name@label.com" className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">PROJECT SCOPE & BUDGET</label>
            <textarea required rows={3} placeholder="Describe the sync placement, album project, or exclusive buyout parameters..." className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition resize-none"></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 rounded-xl transition cursor-pointer shadow-lg shadow-blue-900/40">
            TRANSMIT EXECUTIVE BRIEF
          </button>
        </form>
      )}
    </div>
  );
}
