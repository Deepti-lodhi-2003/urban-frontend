import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, ThumbsDown, ThumbsUp } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function AccountPage() {
  const [currentPage, setCurrentPage] = useState('main');

  const AccountMainPage = () => (
    <div className="space-y-1">
      <button
        onClick={() => setCurrentPage('changePhone')}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <span className="text-base">I want to change my phone number</span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>

      <button
        onClick={() => setCurrentPage('savedAddresses')}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <span className="text-base">Where can I check my saved addresses?</span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>

      <button
        onClick={() => setCurrentPage('changeEmail')}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <span className="text-base">I want to change my email address</span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>

      <button
        onClick={() => setCurrentPage('paymentDetails')}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <span className="text-base">Where can I see my saved payment details?</span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );

  const FeedbackSection = () => (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center gap-4 mb-3">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ThumbsDown className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ThumbsUp className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <p className="text-sm text-gray-600">Was this article helpful?</p>
    </div>
  );

  const ChangePhonePage = () => (
    <div>
      <h1 className="text-3xl font-bold mb-6">I want to change my phone number</h1>
      <p className="text-gray-700 mb-6">
        You can change your phone number from the profile section after verifying it with an OTP.
      </p>
      <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
        Change phone number
      </button>
      <FeedbackSection />
    </div>
  );

  const SavedAddressesPage = () => (
    <div>
      <h1 className="text-3xl font-bold mb-6">Where can I check my saved addresses?</h1>
      <p className="text-gray-700 mb-4">You can check your saved addresses using the following ways:</p>
      <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700">
        <li>While selecting the location on the app homescreen</li>
        <li>Check address on the checkout screen before making payment</li>
      </ol>
      <p className="text-gray-700 mb-6">
        Alternatively, you can also click on the below link to check all saved addresses:
      </p>
      <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
        My addresses
      </button>
      <FeedbackSection />
    </div>
  );

  const ChangeEmailPage = () => (
    <div>
      <h1 className="text-3xl font-bold mb-6">I want to change my email address</h1>
      <p className="text-gray-700 mb-6">
        You can change your email address from the profile section after verifying with an OTP
      </p>
      <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
        Change email address
      </button>
      <FeedbackSection />
    </div>
  );

  const PaymentDetailsPage = () => (
    <div>
      <h1 className="text-3xl font-bold mb-6">Where can I see my saved payment details?</h1>
      <p className="text-gray-700 mb-4">
        You can check all your saved payment details by clicking the below button.
      </p>
      <p className="text-gray-700 mb-6">
        If you wish to remove any saved payment details, you can either <strong>unlink</strong> wallet account or <strong>delete</strong> the saved cards.
      </p>
      <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
        Check saved payments
      </button>
      <FeedbackSection />
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'changePhone':
        return <ChangePhonePage />;
      case 'savedAddresses':
        return <SavedAddressesPage />;
      case 'changeEmail':
        return <ChangeEmailPage />;
      case 'paymentDetails':
        return <PaymentDetailsPage />;
      default:
        return <AccountMainPage />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
         <NavLink to="/help">
             <button
            onClick={() => setCurrentPage('main')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
         </NavLink>
          {currentPage === 'main' && <h1 className="text-xl font-semibold">Account</h1>}
        </div>

        
        <div className="p-6">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}