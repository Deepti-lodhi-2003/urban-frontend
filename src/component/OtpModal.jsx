
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import axiosInstance from '../instant/axios';

export default function OTPModal({ isOpen, onClose, phoneNumber, onSuccess }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) return;
    
    setTimer(30);
    setCanResend(false);
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOTPChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');
      
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split('').forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      setOtp(newOtp);
      
      const lastIndex = Math.min(pastedData.length, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

const handleVerify = async () => {
  if (!otp.every(digit => digit)) return;

  const otpValue = otp.join('');
  setLoading(true);
  setError('');

  try {
    const response = await axiosInstance.post('/auth/verify-otp', {
      phone: phoneNumber,
      otp: otpValue
    });

    console.log('🔍 OTP Verification Response:', response.data);

    if (response.data.success && response.data.token) {
      // ✅ CRITICAL FIX: 'authToken' use karo, 'token' nahi!
      console.log('💾 Saving authToken:', response.data.token);
      localStorage.setItem('authToken', response.data.token); // ✅ FIX
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Verify token saved
      const savedToken = localStorage.getItem('authToken');
      console.log('✅ Token saved successfully:', !!savedToken);
      console.log('✅ Token length:', savedToken?.length);
      
      // Dispatch event for all components
      window.dispatchEvent(new CustomEvent('userLoggedIn'));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      console.log('✅ Login successful:', response.data.user);
      onSuccess();
      setOtp(['', '', '', '', '', '']);
    } else {
      setError('Invalid OTP or verification failed');
    }
  } catch (err) {
    console.error('❌ Error verifying OTP:', err);
    setError(err?.response?.data?.message || err?.message || 'Invalid OTP. Please try again.');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  } finally {
    setLoading(false);
  }
};

  const handleResendSMS = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/send-otp', {
        phone: phoneNumber
      });

      if (response.data.success) {
        setTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        
        if (response.data.otp) {
          console.log('New OTP sent via SMS:', response.data.otp);
        }
        
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError(err || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendWhatsApp = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/send-otp', {
        phone: phoneNumber
      });

      if (response.data.success) {
        setTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        
        if (response.data.otp) {
          console.log('New OTP sent via WhatsApp:', response.data.otp);
        }
        
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      console.error('Error resending OTP via WhatsApp:', err);
      setError(err || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
    setError('');
    onClose();
  };

  const isOTPComplete = otp.every(digit => digit !== '');

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button 
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex gap-2 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">Enter verification code</h2>
        <p className="text-sm text-gray-600 mb-6">
          A 6-digit verification code has been sent to{' '}
          <span className="font-semibold text-gray-900">+91 {phoneNumber}</span>
        </p>

        <div className="flex gap-2 mb-4 justify-center" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading}
              className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        {!canResend && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">
              Resend OTP in <span className="font-semibold text-purple-600">{timer}s</span>
            </p>
          </div>
        )}

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">
            {canResend ? 'Resend the code on' : "Didn't receive the code?"}
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handleResendSMS}
              disabled={!canResend || loading}
              className={`flex-1 px-6 py-2 border rounded-lg text-sm font-medium transition-colors ${
                canResend && !loading
                  ? 'border-purple-600 text-purple-600 hover:bg-purple-50' 
                  : 'border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </span>
              ) : (
                'SMS'
              )}
            </button>
            <button 
              onClick={handleResendWhatsApp}
              disabled={!canResend || loading}
              className={`flex-1 px-6 py-2 border rounded-lg text-sm font-medium transition-colors ${
                canResend && !loading
                  ? 'border-purple-600 text-purple-600 hover:bg-purple-50' 
                  : 'border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </span>
              ) : (
                'WhatsApp'
              )}
            </button>
          </div>
        </div>

        <button 
          disabled={!isOTPComplete || loading}
          onClick={handleVerify}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            isOTPComplete && !loading
              ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying...
            </span>
          ) : (
            isOTPComplete ? 'Verify & Login' : 'Enter OTP to continue'
          )}
        </button>

        <button 
          onClick={handleClose}
          disabled={loading}
          className="w-full mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
        >
          Change phone number
        </button>
      </div>
    </div>
  );
}