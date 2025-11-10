'use client';

import Link from 'next/link';
import { useState } from 'react';
import { APP_NAME, ADMIN_PIN } from '@/lib/constants';

export default function Header() {
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#5333ed] to-[#3b1de8] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{APP_NAME}</span>
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Home
              </Link>
              <a href="#testimonials-section" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Testimonials
              </a>
              <a href="#faq-section" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                FAQ
              </a>
            </div>
          </div>
        </nav>
      </header>

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
