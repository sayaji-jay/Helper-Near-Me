'use client';

import { useState } from 'react';
import { APP_NAME, ADMIN_PIN } from '@/lib/constants';

export default function Footer() {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const handleVerifyPin = () => {
    if (!pin.trim()) {
      setPinError('Please enter a PIN');
      return;
    }

    if (pin === ADMIN_PIN) {
      setShowPinModal(false);
      setPin('');
      setPinError('');
      window.location.href = '/admin';
    } else {
      setPinError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerifyPin();
    }
  };

  return (
    <>
      <footer className="mt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1a1a2e]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/30 px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Left: App Name & Admin Button */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-white font-semibold">{APP_NAME}</div>
                <button
                  onClick={() => setShowPinModal(true)}
                  className="bg-gradient-to-r from-[#5333ed] to-[#3b1de8] text-white px-5 py-2 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Admin</span>
                </button>
              </div>

              {/* Center: Social Icons */}
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>

              {/* Right: Made by */}
              <div className="text-gray-300 text-sm">
                Made by{' '}
                <a href="https://www.sayajiinfotech.com" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-semibold">
                  Sayaji Infotech
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-slideIn">
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Admin Access
              </h2>
              <p className="mt-2 text-white/90 text-sm">Enter PIN to continue</p>
            </div>
            <div className="p-8">
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Enter PIN</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setPinError('');
                  }}
                  onKeyPress={handleKeyPress}
                  maxLength={6}
                  placeholder="Enter your PIN"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl text-center font-semibold text-lg tracking-widest focus:border-[#667eea] focus:outline-none transition-colors"
                />
                {pinError && <div className="mt-2 text-red-500 text-sm font-medium">{pinError}</div>}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setPin('');
                    setPinError('');
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyPin}
                  className="flex-1 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
