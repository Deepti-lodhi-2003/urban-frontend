import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Purchase() {
  return (
    <>

<Header/>

    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - Scrolls with middle */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">Native Water Purifier</h1>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-green-600 text-white text-sm font-semibold px-2 py-1 rounded flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.333 10a8.333 8.333 0 11-16.667 0 8.333 8.333 0 0116.667 0zm-7.894-4.694A.476.476 0 009.999 5a.476.476 0 00-.438.306L8.414 8.191l-2.977.25a.48.48 0 00-.414.342.513.513 0 00.143.532l2.268 2.033-.693 3.039a.51.51 0 00.183.518.458.458 0 00.528.022L10 13.298l2.548 1.629a.458.458 0 00.527-.022.51.51 0 00.184-.518l-.693-3.04 2.268-2.032a.513.513 0 00.143-.532.48.48 0 00-.415-.342l-2.976-.25-1.147-2.885z" fill="white"></path>
                  </svg>
                  <span>4.83</span>
                </div>
                <span className="text-sm text-gray-600">188K reviews</span>
              </div>
              
              <button className="w-full lg:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors mt-4">
                View Services
              </button>
            </div>
          </div>

          {/* Middle Section - Scrollable */}
          <div className="flex-1 min-w-0">
            <div className="border border-gray-200 rounded-lg">
              <div className="px-6 pt-6 pb-4">
                <h2 className="text-3xl font-bold text-gray-900">Models</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {/* Model 1 */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-1.5">Native M1</h3>
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M18.333 10a8.333 8.333 0 11-16.667 0 8.333 8.333 0 0116.667 0zm-7.894-4.694A.476.476 0 009.999 5a.476.476 0 00-.438.306L8.414 8.191l-2.977.25a.48.48 0 00-.414.342.513.513 0 00.143.532l2.268 2.033-.693 3.039a.51.51 0 00.183.518.458.458 0 00.528.022L10 13.298l2.548 1.629a.458.458 0 00.527-.022.51.51 0 00.184-.518l-.693-3.04 2.268-2.032a.513.513 0 00.143-.532.48.48 0 00-.415-.342l-2.976-.25-1.147-2.885z" fill="#572AC8"></path>
                        </svg>
                        <span className="text-xs text-gray-700">4.85 (111K reviews)</span>
                      </div>
                      <div className="">
                        <span className="text-xs font-bold text-gray-900">₹14,699</span>
                        <span className="text-xs text-gray-500 line-through ml-2">₹20,999</span>
                      </div>
                      <button className="text-sm text-purple-600 font-semibold hover:text-purple-700">
                        View details
                      </button>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1751030221140-6ff09d.jpeg"
                          alt="Native M1"
                          className="w-full h-full object-cover"  
                        />
                      </div>
                      <div className="flex justify-center">
                          <button className="bg-white border-1 border-purple-600 text-purple-600 font-semibold py-1.5 px-8 rounded-lg hover:bg-purple-50 transition-colors text-sm md:mt-[-25px]">
                            Add
                          </button>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Model 2 */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-1.5">Native M0</h3>
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M18.333 10a8.333 8.333 0 11-16.667 0 8.333 8.333 0 0116.667 0zm-7.894-4.694A.476.476 0 009.999 5a.476.476 0 00-.438.306L8.414 8.191l-2.977.25a.48.48 0 00-.414.342.513.513 0 00.143.532l2.268 2.033-.693 3.039a.51.51 0 00.183.518.458.458 0 00.528.022L10 13.298l2.548 1.629a.458.458 0 00.527-.022.51.51 0 00.184-.518l-.693-3.04 2.268-2.032a.513.513 0 00.143-.532.48.48 0 00-.415-.342l-2.976-.25-1.147-2.885z" fill="#572AC8"></path>
                        </svg>
                        <span className="text-xs text-gray-700">4.87 (3K reviews)</span>
                      </div>
                      <div className="">
                        <span className="text-xs font-bold text-gray-900">₹11,499</span>
                        <span className="text-xs text-gray-500 line-through ml-2">₹18,999</span>
                      </div>
                      <button className="text-sm text-purple-600 font-semibold hover:text-purple-700">
                        View details
                      </button>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1755707805188-e599e2.jpeg"
                          alt="Native M0"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-center">
                          <button className="bg-white border-1 border-purple-600 text-purple-600 font-semibold py-1.5 px-8 rounded-lg hover:bg-purple-50 transition-colors text-sm md:mt-[-25px]">
                            Add
                          </button>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Model 3 - New Launch */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      {/* <div className="bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded inline-block mb-2">
                        New launch
                      </div> */}
                      <h3 className="text-base font-bold text-gray-900 mb-1.5">Native M2 Pro</h3>
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M18.333 10a8.333 8.333 0 11-16.667 0 8.333 8.333 0 0116.667 0zm-7.894-4.694A.476.476 0 009.999 5a.476.476 0 00-.438.306L8.414 8.191l-2.977.25a.48.48 0 00-.414.342.513.513 0 00.143.532l2.268 2.033-.693 3.039a.51.51 0 00.183.518.458.458 0 00.528.022L10 13.298l2.548 1.629a.458.458 0 00.527-.022.51.51 0 00.184-.518l-.693-3.04 2.268-2.032a.513.513 0 00.143-.532.48.48 0 00-.415-.342l-2.976-.25-1.147-2.885z" fill="#572AC8"></path>
                        </svg>
                        <span className="text-xs text-gray-700">4.82 (72K reviews)</span>
                      </div>
                      <div className="">
                        <span className="text-xs font-bold text-gray-900">₹18,699</span>
                        <span className="text-xs text-gray-500 line-through ml-2">₹26,999</span>
                      </div>
                      <button className="text-sm text-purple-600 font-semibold hover:text-purple-700">
                        View details
                      </button>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1765195701521-d34adc.jpeg"
                          alt="Native M2 Pro"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-center">
                          <button className="bg-white border-1 border-purple-600 text-purple-600 font-semibold py-1.5 px-8 rounded-lg hover:bg-purple-50 transition-colors text-sm md:mt-[-25px]">
                            Add
                          </button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Sticky (doesn't scroll) */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Cart */}
              <div className="rounded-lg border border-gray-200">
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-32 h-24 mb-3">
                    <svg width="100%" height="100%" viewBox="0 0 128 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M77.5 34a.5.5 0 01-.5.5h-2.5V30a.5.5 0 011 0v3.5H77a.5.5 0 01.5.5z" fill="#FFD47F"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M79.5 34a.5.5 0 01-.5.5h-2.5V30a.5.5 0 011 0v3.5H79a.5.5 0 01.5.5z" fill="#FFD47F"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M73 69a1 1 0 011 1v1H61a1 1 0 00-1 1v7h-2v-7a3 3 0 013-3h12zm3 2h9a1 1 0 011 1v7h2v-7a3 3 0 00-3-3h-9.17c.11.313.17.65.17 1v1z" fill="#E2E2E2"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M60 60v10h-2V60h2z" fill="#E2E2E2"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M72 72a1 1 0 00-1-1H47a1 1 0 00-1 1v7h-2v-7a3 3 0 013-3h24a3 3 0 013 3v7h-2v-7z" fill="#E2E2E2"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M74 70v9h-2v-9h2z" fill="#E2E2E2"></path>
                      <path d="M50 79a5 5 0 11-10 0 5 5 0 0110 0zM64 79a5 5 0 11-10 0 5 5 0 0110 0zM78 79a5 5 0 11-10 0 5 5 0 0110 0zM92 79a5 5 0 11-10 0 5 5 0 0110 0z" fill="#757575"></path>
                      <path d="M48 79a3 3 0 11-6 0 3 3 0 016 0zM62 79a3 3 0 11-6 0 3 3 0 016 0zM76 79a3 3 0 11-6 0 3 3 0 016 0zM90 79a3 3 0 11-6 0 3 3 0 016 0z" fill="#EEE"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M74 60v10h-2V60h2z" fill="#E2E2E2"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M30.832 25.445l8 12-1.664 1.11-8-12 1.664-1.11zm16 0l8 12-1.664 1.11-8-12 1.664-1.11z" fill="#CBCBCB"></path>
                      <path d="M44 34h52l-5.694 30.369A2 2 0 0188.34 66H53.32a4 4 0 01-3.932-3.263L44 34z" fill="#CBCBCB"></path>
                      <path d="M34 34h48l-6 32H41.66a2 2 0 01-1.966-1.631L34 34z" fill="#E2E2E2"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M46 40h-2v7.059h2V40zm0 12.941h-2V60h2v-7.059zM50 40h2v7.059h-2V40zm2 12.941h-2V60h2v-7.059zM56 40h2v7.059h-2V40zm2 12.941h-2V60h2v-7.059zM62 40h2v7.059h-2V40zm2 12.941h-2V60h2v-7.059zM68 40h2v7.059h-2V40zm2 12.941h-2V60h2v-7.059z" fill="#fff"></path>
                      <path d="M24 24h28v4H24v-4z" fill="#97674E"></path>
                      <path d="M78 20h6v4a6 6 0 01-6 6V20zM78 15a3 3 0 116 0v5h-6v-5zM78 30V18L66 30h12z" fill="#997BED"></path>
                      <path d="M88 16l-4-1v2l4-1z" fill="#FFD47F"></path>
                      <path d="M81 15a1 1 0 112 0 1 1 0 01-2 0z" fill="#0F0F0F"></path>
                      <path d="M72 30h-6l12-12v6a6 6 0 01-6 6z" fill="#6E42E5"></path>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">No items in your cart</p>
                </div>
              </div>

              {/* Offer Card */}
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#05945B" xmlns="http://www.w3.org/2000/svg"><path d="M7.75 8.5a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM14.75 15.5a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" fill="#05945B"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm6.5-5.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm7 7a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-8.93 3.12l9.9-9.9 1.06 1.06-9.9 9.9-1.06-1.06z" fill="#05945B"></path></svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Flat 10% off upto ₹1500</h3>
                    <p className="text-sm text-gray-600">Yes Bank CC EMI</p>
                  </div>
                </div>
                <button className="text-purple-600 text-sm font-semibold hover:text-purple-700">
                  View More Offers ∨
                </button>
              </div>

              {/* UC Promise */}
              <div className="rounded-lg border border-gray-200 px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">UC Promise</h3>
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1702985608819-4a9ba6.jpeg" 
                      alt="UC Promise"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M9.75 15.836l9.793-9.793 1.414 1.415-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25 1.414-1.415 4.543 4.543z" fill="#0F0F0F"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Verified Professionals</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M9.75 15.836l9.793-9.793 1.414 1.415-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25 1.414-1.415 4.543 4.543z" fill="#0F0F0F"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Hassle Free Booking</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M9.75 15.836l9.793-9.793 1.414 1.415-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25 1.414-1.415 4.543 4.543z" fill="#0F0F0F"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Transparent Pricing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer/>
    </>
  );
}