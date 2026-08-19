import React, { useState } from 'react';

export function VipNewsletterSection() {
  const [submitted, setSubmitted] = useState(false);
  const [stageName, setStageName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stageName || !email) return;

    try {
      const form = e.currentTarget;
      const formAction = form.action;
      let success = false;

      if (formAction) {
        const formData = new FormData(form);
        const response = await fetch(formAction, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          alert("You're locked in! Sent straight to your inbox.");
          form.reset();
          success = true;
        } else {
          alert("Formspree submission error. Falling back to local subscriber register.");
        }
      }

      // Also sync to local database
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, stageName }),
      }).catch(err => console.warn('Local API sync notice:', err));

      if (success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Network error', err);
    }
  };

  return (
    <div className="bg-gray-950 border border-blue-900/40 rounded-2xl p-6 text-white shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1 max-w-lg">
          <span className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-mono uppercase tracking-widest">
            RAPPER EXCLUSIVE ACCESS
          </span>
          <h3 className="text-xl font-black tracking-wide text-white mt-2">Join the KRYPSIDE VIP Newsletter</h3>
          <p className="text-xs text-gray-400">
            Subscribing unlocks <span className="text-blue-400 font-bold">instant free beat downloads</span>, VIP discount keys, and live automated email & text drops the millisecond a new banger hits the store.
          </p>
        </div>

        <div className="w-full md:w-auto bg-black/60 border border-gray-900 p-4 rounded-xl">
          {submitted ? (
            <div className="text-center py-3 px-6 space-y-1">
              <h5 className="font-bold text-sm text-blue-400">VIP Access Unlocked!</h5>
              <p className="text-[11px] text-gray-400">Check your inbox for your free beat downloads.</p>
            </div>
          ) : (
            <form 
              id="newsletterForm" 
              action="https://formspree.io/f/mbgrddkj" 
              method="POST" 
              onSubmit={handleSubmit} 
              className="space-y-3 w-full md:w-80"
            >
              <div className="input-group grid grid-cols-1 gap-2">
                <input 
                  type="text" 
                  name="artistName"
                  required
                  placeholder="Artist / Stage Name" 
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 outline-none transition" 
                />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="Your Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 outline-none transition" 
                />
              </div>
              <button 
                type="submit" 
                id="submitBtn"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-lg transition cursor-pointer shadow-lg shadow-blue-900/40"
              >
                Unlock VIP Access & Free Downloads
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
