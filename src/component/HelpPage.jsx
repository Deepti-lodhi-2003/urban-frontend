import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, ChevronRight, User, Rocket, Wallet, Target, Shield, Award } from 'lucide-react';

export default function HelpPage() {
  const topics = [
    { icon: User, label: 'Account' },
    { icon: Rocket, label: 'Getting started with UC' },
    { icon: Wallet, label: 'Payment & UC Credits' },
    { icon: Target, label: 'UC Plus Membership' },
    { icon: Shield, label: 'UC Safety' },
    { icon: Award, label: 'Claim Warranty' }
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-4">
         <NavLink 
         to="/"
         >
             <button className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
         </NavLink>
          <h1 className="text-xl font-semibold">Help</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">All topics</h2>

          {/* Topics List */}
          <div className="space-y-1">
            {topics.map((topic, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <topic.icon className="w-5 h-5 text-gray-700" />
                  <span className="text-base font-medium text-gray-900">{topic.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}