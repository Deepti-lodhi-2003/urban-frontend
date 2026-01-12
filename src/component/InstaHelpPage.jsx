import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function InstaHelpPage() {
  return (
    <>
    <Header/>

    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          <div className="w-full lg:w-[20vw]">
            <div className="">
              <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">Insta Help</h1>
              <div className="flex items-center gap-2 mb-3">
                <svg width="8%" height="8%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18.333 10a8.333 8.333 0 11-16.667 0 8.333 8.333 0 0116.667 0zm-7.894-4.694A.476.476 0 009.999 5a.476.476 0 00-.438.306L8.414 8.191l-2.977.25a.48.48 0 00-.414.342.513.513 0 00.143.532l2.268 2.033-.693 3.039a.51.51 0 00.183.518.458.458 0 00.528.022L10 13.298l2.548 1.629a.458.458 0 00.527-.022.51.51 0 00.184-.518l-.693-3.04 2.268-2.032a.513.513 0 00.143-.532.48.48 0 00-.415-.342l-2.976-.25-1.147-2.885z" fill="#572AC8"></path></svg>
                <span className="font-semibold text-gray-900">4.73</span>
                <span className="text-gray-600">(2.2 M bookings)</span>
              </div>
              <div className="w-46 border-b border-dashed border-gray-400 mb-4"></div>
              
              <button className="w-full lg:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors mt-4">
                View Services
              </button>
            </div>
          </div>

     
          <div className="flex-1 flex flex-col lg:flex-row gap-6">
           
            <div className="flex-1">
              <div className="border lg:border-x lg:border-t border-gray-200 rounded-lg lg:rounded-none px-4 lg:px-6 pt-4 lg:pt-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Save more with packages</h2>

               
                <div className="border-b border-gray-200 rounded-lg px-2 lg:px-4 py-6 lg:py-9 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   
                    <div className="md:col-span-2">
                      <h3 className="font-bold text-gray-900 mb-1">Insta Help</h3>
                      <div className="flex items-center gap-2 mb-2">
                         <svg width="5%" height="5%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18.333 10a8.333 8.333 0 11-16.667 0 8.333 8.333 0 0116.667 0zm-7.894-4.694A.476.476 0 009.999 5a.476.476 0 00-.438.306L8.414 8.191l-2.977.25a.48.48 0 00-.414.342.513.513 0 00.143.532l2.268 2.033-.693 3.039a.51.51 0 00.183.518.458.458 0 00.528.022L10 13.298l2.548 1.629a.458.458 0 00.527-.022.51.51 0 00.184-.518l-.693-3.04 2.268-2.032a.513.513 0 00.143-.532.48.48 0 00-.415-.342l-2.976-.25-1.147-2.885z" fill="#572AC8"></path></svg>
                        <span className="text-sm text-gray-700">4.71 (0.4M reviews)</span>
                      </div>
                      <div className="w-36 border-b border-dashed border-gray-300 mb-6"></div>
                      <div className="mb-2">
                        <span className="font-bold text-gray-900">Starts at ₹99</span>
                        <span className="text-sm text-gray-500 line-through ml-2">₹245</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Get instant help or schedule ahead with exclusive slots
                      </p>
                      <button className="text-purple-600 font-semibold text-sm hover:text-purple-700">
                        View details
                      </button>
                    </div>

                  
                    <div className="md:col-span-1 flex flex-row md:flex-col gap-4 md:gap-0">
                      <div className="rounded-lg overflow-hidden mb-0 md:mb-2 flex-1 h-32 md:h-auto">
                        <img
                          src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1763722686980-6b1bd2.jpeg"
                          alt="Insta Help"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center md:justify-start">
                        <div className="flex justify-center">
                          <button className="bg-white border-1 border-purple-600 text-purple-600 font-semibold py-1.5 px-8 rounded-lg hover:bg-purple-50 transition-colors text-sm md:mt-[-25px]">
                            Add
                          </button>
                        </div>
                        <span className="text-xs text-gray-500 text-center mt-1">5 options</span>
                      </div>
                    </div>
                  </div>
                </div>

               
                <div className="border-b border-gray-200 rounded-lg px-2 lg:px-4 py-6 lg:py-7 relative">
                  <div className="bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2 py-1 rounded inline-block mb-2">
                    LIMITED PERIOD OFFER
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   
                    <div className="md:col-span-2">
                      <h3 className="font-bold text-gray-900 mb-1">3 visits: Insta help saver pack</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-2 mb-2">
                         <svg width="5%" height="5%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18.333 10a8.333 8.333 0 11-16.667 0 8.333 8.333 0 0116.667 0zm-7.894-4.694A.476.476 0 009.999 5a.476.476 0 00-.438.306L8.414 8.191l-2.977.25a.48.48 0 00-.414.342.513.513 0 00.143.532l2.268 2.033-.693 3.039a.51.51 0 00.183.518.458.458 0 00.528.022L10 13.298l2.548 1.629a.458.458 0 00.527-.022.51.51 0 00.184-.518l-.693-3.04 2.268-2.032a.513.513 0 00.143-.532.48.48 0 00-.415-.342l-2.976-.25-1.147-2.885z" fill="#572AC8"></path></svg>
                        <span className="text-sm text-gray-700">4.71 (0.4M reviews)</span>
                      </div>
                      </div>
                      <div className="mb-2">
                        <span className="font-bold text-gray-900">Starts at ₹249</span>
                        <span className="text-sm text-gray-500 line-through ml-2">₹735</span>
                      </div>
                      <div className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded inline-block mb-2">
                        ◆ Starts at ₹83/service
                      </div>

                      <ul className="text-sm text-gray-700 mb-3 space-y-1">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Get instant help or schedule ahead with exclusive slots</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Use anytime within a month</span>
                        </li>
                      </ul>

                      <button className="text-purple-600 font-semibold text-sm hover:text-purple-700">
                        View details
                      </button>
                    </div>

                  
                    <div className="md:col-span-1 flex flex-row md:flex-col gap-4 md:gap-0">
                      <div className="rounded-lg overflow-hidden mb-0 md:mb-2 flex-1 h-32 md:h-auto">
                        <img
                          src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1763722689396-489e3f.jpeg"
                          alt="Saver Pack"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center md:justify-start">
                        <div className="flex justify-center">
                          <button className="bg-white border-1 border-purple-600 text-purple-600 font-semibold py-1.5 px-8 rounded-lg hover:bg-purple-50 transition-colors text-sm md:mt-[-25px]">
                            Add
                          </button>
                        </div>
                        <span className="text-xs text-gray-500 text-center mt-1">3 options</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="w-full lg:w-[23vw] space-y-6">
             
              <div className="rounded-lg border border-gray-200">
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-32 h-24 mb-2">
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