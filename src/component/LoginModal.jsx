
import React, { useState } from 'react';
import { X } from 'lucide-react';
import OTPModal from './OTPModal';
import axiosInstance from '../instant/axios';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleContinue = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/send-otp', {
        phone: phoneNumber
      });

      if (response.data.success) {
        setShowOTPModal(true);
        
        if (response.data.otp) {
          console.log('OTP sent:', response.data.otp);
        }
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(err || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = () => {
    setShowOTPModal(false);
    onClose();
    onLoginSuccess();
  };

  const handleCloseOTP = () => {
    setShowOTPModal(false);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError('');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/>
              </svg>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg"></div>
          </div>

          <h2 className="text-2xl font-bold mb-2">Enter your phone number</h2>
          <p className="text-sm text-gray-600 mb-6">
            We'll send you a text with a verification code. Standard tariff may apply.
          </p>

          <div className="flex gap-2 mb-4">
            <select 
              className="px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:border-purple-600"
              disabled={loading}
            >
              <option>+91</option>
            </select>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={handlePhoneChange}
              maxLength={10}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button 
            disabled={!phoneNumber || phoneNumber.length < 10 || loading}
            onClick={handleContinue}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              phoneNumber && phoneNumber.length === 10 && !loading
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending OTP...
              </span>
            ) : (
              'Continue'
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By continuing, you agree to our{' '}
            <a href="#" className="text-purple-600 underline">T&C</a>
            {' '}and{' '}
            <a href="#" className="text-purple-600 underline">Privacy</a>
            {' '}policy.
          </p>
        </div>
      </div>

      {showOTPModal && (
        <OTPModal
          isOpen={showOTPModal}
          onClose={handleCloseOTP}
          phoneNumber={phoneNumber}
          onSuccess={handleOTPSuccess}
        />
      )}
    </>
  );
}