
import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function Modal({ onClose }) {
    const [showModal, setShowModal] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [showAllReviews, setShowAllReviews] = useState(false);

    return (
        <>
        <style>{`
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>
        {showModal && (
            <div className="fixed inset-0 bg-black/80 bg-opacity-10 z-50 flex items-center justify-center px-4 pt-4 overflow-y-auto">
                <div className="bg-white rounded-2xl max-w-2xl w-full my-8 relative">
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="sticky top-4 left-full ml-[-3rem] w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-10 hover:bg-gray-100"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6l12 12" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>

                    {/* Modal Content */}
                    <div className="p-6 max-h-[85vh] overflow-y-auto">
                        {/* Video/Image Slider */}
                        <div className="relative overflow-hidden mb-6 md:mb-10 rounded-lg">
                        <video
                            playsInline
                            crossOrigin="anonymous"
                            poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0AQMAAADfKmdSAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRF9fX1sGmfigAAAB5JREFUeJztwTEBAAAAwqD1T20ND6AAAAAAAAAAfg0c1AABWiieBAAAAABJRU5ErkJggg=="
                            autoPlay
                            muted
                            loop
                            className="w-full lg:w-[63vw] rounded-lg"
                            style={{ aspectRatio: "16 / 9" }}
                        >
                            <source
                                src="https://content.urbancompany.com/videos/supply/customer-app-supply/1752832130236-f3b97a/1752832130236-f3b97a.m3u8"
                                type="video/mp4"
                            />
                        </video>

                        {/* <video data-src="https://content.urbancompany.com/videos/supply/customer-app-supply/1749625423509-fd8c48/1749625423509-fd8c48.m3u8" playsinline="" crossorigin="anonymous" poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0AQMAAADfKmdSAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRF9fX1sGmfigAAAB5JREFUeJztwTEBAAAAwqD1T20ND6AAAAAAAAAAfg0c1AABWiieBAAAAABJRU5ErkJggg==" autoplay="" class="PMJaxbEb " style="aspect-ratio: 1.77778 / 1;" src="blob:https://www.urbancompany.com/aad91ead-7f67-468b-a533-e434aaba3ec8"><source src="https://content.urbancompany.com/videos/supply/customer-app-supply/1749625423509-fd8c48/1749625423509-fd8c48.m3u8"><track kind="captions" srclang="en" label="english_captions"></video> */}

                        {/* Animated Progress Line */}
                        <div className="absolute bottom-5 left-0 w-full lg:w-[63vw] h-1 bg-gray-200 z-10">
                            <div className="h-full bg-white animate-progress"></div>
                        </div>

                        <style>{`
                            @keyframes progress {
                                0% { width: 0%; }
                                100% { width: 100%; }
                            }
                            .animate-progress {
                                animation: progress 5s ease-in-out infinite;
                            }
                        `}</style>
                    </div>

                        {/* Service Title */}
                        <h2 className="text-2xl font-bold mb-2">Intense bathroom cleaning</h2>
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="w-4 h-4 fill-gray-600 text-gray-600" />
                            <span className="text-sm font-medium">4.79 (4M reviews)</span>
                        </div>
                        <p className="text-green-600 text-sm font-medium mb-6">
                            <div className='flex items-center gap-2'>
                                <svg width="13" height="13" viewBox="0 0 16 16" fill="#07794C" xmlns="http://www.w3.org/2000/svg"><path d="M15 7.929L8.472 1.4a.997.997 0 00-.904-.274l-5.04 1.008a.5.5 0 00-.393.393l-1.008 5.04a.998.998 0 00.274.904L7.928 15a.999.999 0 001.414 0L15 9.343a.999.999 0 000-1.414zM5.25 6a.75.75 0 110-1.5.75.75 0 010 1.5z" fill="#07794C"></path></svg>
                             Add more & save up to 18%
                                </div></p>

                        {/* Bathroom Options Slider */}
                        <div className="mb-6">
                            <div className="relative">
                                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                    <div className="flex-shrink-0 w-44 border-2 border-gray-200 rounded-lg p-4 hover:border-purple-600 cursor-pointer">
                                        <div className="text-sm text-gray-600 mb-1">1 Bathroom</div>
                                        <div className="font-bold text-lg">₹449</div>
                                        <div className="text-xs text-gray-500 line-through">₹549</div>
                                    </div>
                                    <div className="flex-shrink-0 w-44 border-2 border-purple-600 rounded-lg p-4 bg-purple-50">
                                        <div className="text-sm text-gray-600 mb-1">2 Bathrooms</div>
                                        <div className="font-bold text-lg">₹898</div>
                                        <div className="text-xs text-gray-500 line-through">₹1098</div>
                                        <div className="text-xs text-green-600 font-medium">(₹449/bathroom)</div>
                                        <div className="text-xs text-purple-600 font-medium">18% off</div>
                                    </div>
                                    <div className="flex-shrink-0 w-44 border-2 border-gray-200 rounded-lg p-4 hover:border-purple-600 cursor-pointer">
                                        <div className="text-sm text-gray-600 mb-1">3 Bathrooms</div>
                                        <div className="font-bold text-lg">₹1347</div>
                                        <div className="text-xs text-gray-500 line-through">₹1647</div>
                                        <div className="text-xs text-gray-500">(₹449/bathroom)</div>
                                        <div className="text-xs text-purple-600 font-medium">18% off</div>
                                    </div>
                                    <div className="flex-shrink-0 w-44 border-2 border-gray-200 rounded-lg p-4 hover:border-purple-600 cursor-pointer">
                                        <div className="text-sm text-gray-600 mb-1">4 Bathrooms</div>
                                        <div className="font-bold text-lg">₹1796</div>
                                        <div className="text-xs text-gray-500 line-through">₹2196</div>
                                        <div className="text-xs text-gray-500">(₹449/bathroom)</div>
                                        <div className="text-xs text-purple-600 font-medium">18% off</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-gray-200 mb-6"></div>

                        {/* Frequently Added Together */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-4">Frequently added together</h3>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                <div className="flex-shrink-0 w-50  p-3 text-center">
                                    <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                                        <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1726832914299-3a020f.jpeg" alt="Washbasin" className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="text-xs mb-2">Additional washbasin cleaning</div>
                                    <div className='flex items-center justify-between px-3'>
                                        <div className="font-bold text-sm">₹69</div>
                                    <button className="text-purple-600 text-xs font-medium">Add</button>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 w-50  p-3 text-center">
                                    <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                                        <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1743139385943-053baa.jpeg" alt="Mirror" className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="text-xs mb-2">Mirror cleaning (upto 1)</div>
                                    <div className='flex items-center justify-between px-3'>
                                        <div className="font-bold text-sm mb-2">₹59</div>
                                    <button className="text-purple-600 text-xs font-medium">Add</button>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 w-50  p-3 text-center">
                                    <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                                        <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1750094383880-f7fb72.jpeg" alt="Fan" className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="text-xs mb-2">Exhaust fan cleaning</div>
                                    <div className='flex items-center justify-between px-3'>
                                        <div className="font-bold text-sm mb-2">₹89</div>
                                    <button className="text-purple-600 text-xs font-medium">Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-gray-200 mb-6"></div>

                        {/* See the Difference */}
                        <div className="mb-6">
                            {/* <h3 className="text-xl font-bold mb-4">See the difference yourself</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {[1, 2, 3, 4].map((idx) => (
                                    <div key={idx} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                        <img 
                                            src={`https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/images/growth/luminosity/174558${2700 + idx * 100}726-ea844c.jpeg`}
                                            alt={`Before/After ${idx}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium">Before</div>
                                        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium">After</div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-1 h-full bg-white"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                                View more →
                            </button> */}
                            <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1752495306912-ceda64.jpeg" alt="" />
                            <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1752495339013-c123da.jpeg" alt="" />
                        </div>

                        <div className="border-b border-gray-200 mb-6"></div>

                        {/* Top Cleaners */}
                        <div className="mb-6">
                            {/* <h3 className="text-xl font-bold mb-4">Top cleaners</h3>
                            <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-4">
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/images/growth/luminosity/1729157998400-25dfc9.jpeg" alt="Cleaner" className="w-full h-full object-cover"/>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L13.5 9H21L15 13.5L17 21L12 16.5L7 21L9 13.5L3 9H10.5L12 2Z" fill="#6B46C1"/>
                                        </svg>
                                        <span className="text-sm">Trained for 100+ hours</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Star className="w-4 h-4 fill-purple-600 text-purple-600" />
                                        <span className="text-sm">Average 4.8+ ratings</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="#6B46C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span className="text-sm">Served 100K+ homes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#6B46C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span className="text-sm">Verified by UC</span>
                                    </div>
                                </div>
                            </div> */}


                            <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_999,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1757397970459-df400e.jpeg" alt="" />
                        </div>

                        <div className="border-b border-gray-200 mb-6"></div>

                        {/* Cleaning Equipment */}
                        <div className="mb-6">
                            {/* <h3 className="text-xl font-bold mb-4">Our cleaning equipments</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center p-4">
                                        <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/images/growth/luminosity/1729157998400-25dfc9.jpeg" alt="Equipment" className="w-full h-full object-contain"/>
                                    </div>
                                    <div className="text-xs font-medium">Buffing machine</div>
                                </div>
                                <div className="text-center">
                                    <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center p-4">
                                        <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/images/supply/customer-app-supply/1732776199891-2f299a.jpeg" alt="Cloths" className="w-full h-full object-contain"/>
                                    </div>
                                    <div className="text-xs font-medium">Microfibre cloths</div>
                                </div>
                                <div className="text-center">
                                    <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center p-4">
                                        <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/images/growth/luminosity/1745582700726-ea844c.jpeg" alt="Sponge" className="w-full h-full object-contain"/>
                                    </div>
                                    <div className="text-xs font-medium">Sponge</div>
                                </div>
                            </div> */}

                            <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_999,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1749809665491-8608c2.jpeg" alt="" />
                        </div>

                        <div className="border-b border-gray-200 mb-6"></div>

                        {/* What is Covered */}
                        <div className="mb-6">
                           <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_999,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1749809678862-276d4a.jpeg" alt="" />

                            {/* <h3 className="text-xl font-bold mb-4">What is covered</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-sm">Hard water stains</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-sm">Toilet seat from outside & inside</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-sm">Sink, tiles, taps & other fixtures</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-sm">Mirrors, windows & glass partition</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-sm">Exhaust fan & other hard to reach areas</span>
                                </div>
                            </div> */}
                        </div>

                        <div className="border-b border-gray-200 mb-6"></div>

                        {/* What We Need */}
                        <div className="mb-6">
                            {/* <h3 className="text-xl font-bold mb-4">What we will need from you</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 border rounded-lg">
                                    <div className="w-12 h-12 mx-auto mb-2">
                                        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 40h24v8H20z" fill="#6B46C1"/>
                                            <path d="M16 16h32v24H16z" fill="#9F7AEA"/>
                                        </svg>
                                    </div>
                                    <div className="text-xs font-medium">Bucket & water</div>
                                </div>
                                <div className="text-center p-3 border rounded-lg">
                                    <div className="w-12 h-12 mx-auto mb-2">
                                        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="24" y="16" width="16" height="32" rx="2" fill="#6B46C1"/>
                                        </svg>
                                    </div>
                                    <div className="text-xs font-medium">Power point</div>
                                </div>
                                <div className="text-center p-3 border rounded-lg">
                                    <div className="w-12 h-12 mx-auto mb-2">
                                        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M32 16l-8 24h16l-8 24" stroke="#6B46C1" strokeWidth="3"/>
                                        </svg>
                                    </div>
                                    <div className="text-xs font-medium">Ladder or Stool</div>
                                </div>
                            </div> */}

                            <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_999,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1749809659584-fc3f48.jpeg" alt="" />
                        </div>

                        <div className="border-b border-gray-200 mb-6"></div>

                        {/* What is Not Covered */}
                        <div className="mb-6">
                            {/* <h3 className="text-xl font-bold mb-4">What is not covered</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-sm">Cements & rust stains</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-sm">Cabinet interiors, buckets, mugs & stools</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-sm">Dismantling & cleaning of any appliance</span>
                                </div>
                            </div> */}
                            <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_999,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1749809682895-2ede4b.jpeg" alt="" />
                        </div>

                        <div className="border-b border-gray-200 mb-6"></div>

                        {/* Damage Protection */}
                        <div className="mb-6">
                            {/* <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold mb-1">Damage protection</h4>
                                        <p className="text-sm text-gray-700">Up to ₹10,000 cover if any damage happens during the job</p>
                                    </div>
                                </div>
                            </div> */}

                            <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_999,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1749809673844-deab04.jpeg" alt="" />
                        </div>

                        <div className="border-b border-gray-200 mb-6"></div>

                        {/* FAQ Section */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-4">Frequently asked questions</h3>
                            <div className="space-y-3">
                                <details className="border rounded-lg p-4">
                                    <summary className="font-medium cursor-pointer">Do I need to provide any cleaning materials or chemicals?</summary>
                                    <p className="text-sm text-gray-600 mt-2">No, our professionals bring all necessary cleaning materials and chemicals.</p>
                                </details>
                                <details className="border rounded-lg p-4">
                                    <summary className="font-medium cursor-pointer">What if there's no electricity during the service?</summary>
                                    <p className="text-sm text-gray-600 mt-2">Some equipment requires electricity. Please ensure power availability.</p>
                                </details>
                            </div>
                        </div>

                        <div className="border-b border-gray-200 mb-6"></div>

                        {/* Reviews Section */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">⭐4.79</h3>
                                <button className="text-purple-600 text-sm font-medium">Filter</button>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">4.0M reviews</p>
                            
                            {/* Rating bars */}
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs w-6">⭐5</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                        <div className="h-full bg-purple-600 rounded-full" style={{width: '90%'}}></div>
                                    </div>
                                    <span className="text-xs w-12 text-right">3.7 M</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs w-6">⭐4</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                        <div className="h-full bg-purple-600 rounded-full" style={{width: '15%'}}></div>
                                    </div>
                                    <span className="text-xs w-12 text-right">141K</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs w-6">⭐3</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                        <div className="h-full bg-purple-600 rounded-full" style={{width: '7%'}}></div>
                                    </div>
                                    <span className="text-xs w-12 text-right">66K</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs w-6">⭐2</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                        <div className="h-full bg-purple-600 rounded-full" style={{width: '4%'}}></div>
                                    </div>
                                    <span className="text-xs w-12 text-right">39K</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs w-6">⭐1</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                        <div className="h-full bg-purple-600 rounded-full" style={{width: '3%'}}></div>
                                    </div>
                                    <span className="text-xs w-12 text-right">74K</span>
                                </div>
                            </div>

                            {/* All Reviews Header */}
                            <h4 className="font-bold text-lg mb-3">All reviews</h4>

                        {/* Filter buttons */}
                        <div className="flex gap-2 mb-4 overflow-x-auto">
                            <button className="px-4 py-2 border rounded-full text-sm whitespace-nowrap">Most detailed</button>
                            <button className="px-4 py-2 border rounded-full text-sm whitespace-nowrap">In my area</button>
                            <button className="px-4 py-2 border rounded-full text-sm whitespace-nowrap">Frequent users</button>
                        </div>

                        {/* Review Cards */}
                        <div className="space-y-4">
                            <div className="border-b pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Srinivas C</span>
                                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                        ⭐ 5
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">Dec 27, 2025 • For Intense bathroom cleaning</p>
                                <p className="text-sm text-gray-700">Excellent work. I recommend Mahesh to other customers, so be patient and complete the work without giving you a chance to complain. I tried several services so far but for the first time we were impressed with this man.</p>
                            </div>

                            <div className="border-b pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Sanchita Rai</span>
                                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                        ⭐ 5
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">Dec 27, 2025 • For Intense bathroom cleaning</p>
                                <p className="text-sm text-gray-700">So happy with the cleaning and the excellent part is he didn't even bothered for anything, figured out everything by himself. The best cleaning from urban clap person.</p>
                            </div>

                            <div className="border-b pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Jacqueline Nunes</span>
                                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                        ⭐ 4.5
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">Dec 27, 2025 • For Intense bathroom cleaning</p>
                                <p className="text-sm text-gray-700">Grouting could be cleaned better..apparently they are expected to complete within a specified timeframe so he can't spend time to clean the grouting...</p>
                            </div>

                            <div className="pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Saikrishna Parnapalli</span>
                                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                        ⭐ 5
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">Dec 27, 2025 • For Intense bathroom cleaning</p>
                                <p className="text-sm text-gray-700 mb-3">Firstly, Mr. Praveen was a very detail-oriented service person. He has done the cleaning job of both my bathrooms without any remark and has cleaned every nook and corner that dirt had gone into.</p>
                                <p className="text-sm text-gray-700 mb-3"><strong>Bathroom Cleaning:</strong> Excellent bathroom cleaning. Tiles, fittings, washbasin, and toilet were cleaned very well. No odor left behind, and everything looks hygienic and shiny.</p>
                                <p className="text-sm text-gray-700">Overall, I'm very satisfied with his work and would definitely recommend him to anyone looking for a bathroom cleaning job.</p>
                                <button className="text-purple-600 text-sm font-medium mt-2">Show more</button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="sticky bottom-0 mt-6 bg-white border-t border-gray-300 pt-4 -mx-6 px-6 flex items-center justify-between">
                        <div className="flex items-center gap-4 ">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-purple-600 font-bold hover:bg-gray-50"
                            >
                                −
                            </button>
                            <span className="font-medium">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-purple-600 font-bold hover:bg-gray-50"
                            >
                                +
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="font-bold text-lg">₹{quantity * 898}</div>
                                <div className="text-xs text-gray-500 line-through">₹{quantity * 1098}</div>
                            </div>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}
    </>
);
}