import React from 'react';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo */}
        <div className="mb-12">
          <img 
            src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_144,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/partner-training/1628575858610-5b0ae4.png" 
            alt="Urban Company" 
            className="w-40"
          />
        </div>

        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div>
            <h3 className="text-gray-900 font-semibold text-xl mb-3">Company</h3>
            <ul className="space-y-1.5">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">About us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Investor Relations</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms & conditions</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Anti-discrimination policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">ESG Impact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Careers</a></li>
            </ul>
          </div>

          {/* For customers */}
          <div>
            <h3 className="text-gray-900 font-semibold text-xl mb-3">For customers</h3>
            <ul className="space-y-1.5">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">UC reviews</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Categories near you</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Contact us</a></li>
            </ul>
          </div>

          {/* For professionals */}
          <div>
            <h3 className="text-gray-900 font-semibold text-xl mb-3">For professionals</h3>
            <ul className="space-y-1.5">
              <NavLink to="/providerform">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Register as a professional</a></li>
              </NavLink>
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h3 className="text-gray-900 font-semibold text-xl mb-3">Social links</h3>
            
            {/* Social Icons */}
            <div className="flex gap-3 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Twitter className="w-4 h-4 text-gray-800" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Facebook className="w-4 h-4 text-gray-800" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Instagram className="w-4 h-4 text-gray-800" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Linkedin className="w-4 h-4 text-gray-800" />
              </a>
            </div>

            {/* App Store Buttons */}
            <div className="space-y-3">
              <a href="#" className="block">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/640px-Download_on_the_App_Store_Badge.svg.png" 
                  alt="Download on App Store" 
                  className="h-9"
                />
              </a>
              <a href="#" className="block">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/640px-Google_Play_Store_badge_EN.svg.png" 
                  alt="Get it on Google Play" 
                  className="h-9"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-xs text-gray-600">
              <p className="mb-1">* As on December 31, 2024</p>
              <p>© Copyright 2025 Urban Company Limited (formerly known as UrbanClap Technologies India Limited and UrbanClap Technologies India India Limited) All rights reserved. | CIN: L74140DL2014PLC274413</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}