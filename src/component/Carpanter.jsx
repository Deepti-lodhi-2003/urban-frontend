import React, { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

export default function Carpanter() {
    const [cart, setCart] = useState([]);

    const services = [
        {
            category: "Cupboard & drawer",
            items: [
                {
                    name: "Switch/socket repair & replacement",
                    rating: 4.82,
                    reviews: "93K",
                    price: 69,
                    options: 3,
                    image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729092014836-a9afd9.jpeg"
                },
                {
                    name: "Switchboard repair & replacement",
                    rating: 4.82,
                    reviews: "46K",
                    price: 99,
                    options: 4,
                    description: "Repair or replacement using existing in-wall wiring",
                    image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1732776199891-2f299a.jpeg"
                },
                {
                    name: "Plug replacement",
                    rating: 4.82,
                    reviews: "93K",
                    price: 69,
                    options: 3,
                    image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1733207426093-a2fbcd.jpeg"
                },
                {
                    name: "New switchbox installation",
                    rating: 4.82,
                    reviews: "46K",
                    price: 99,
                    options: 4,
                    description: "Repair or replacement using existing in-wall wiring",
                    image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1732776206619-c928d4.jpeg"
                }
            ]
        },
        {
            category: "Other Services",
            items: [
                {
                    name: "Submeter installation",
                    rating: 4.78,
                    reviews: "1K",
                    price: 249,
                    duration: "30 mins",
                    image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729158359948-f400ad.jpeg"
                }
            ]
        },
        {
            category: "Appliances",
            items: [
                {
                    name: "Home theatre installation",
                    rating: 4.69,
                    reviews: "3K",
                    price: 199,
                    duration: "30 mins",
                    description: "Installation of 2 speakers, 1 sound bar & 1 subwoofer",
                    image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1714115319081-ab4ca1.jpeg"
                },
                {
                    name: "TV installation",
                    rating: 4.42,
                    reviews: "6K",
                    price: 299,
                    options: 5,
                    image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1730796946106-bd0a19.jpeg"
                }
            ]
        },
        {
            category: "Fan",
            items: [
                {
                    name: "Regular ceiling fan installation",
                    rating: 4.56,
                    reviews: "58K",
                    price: 99,
                    options: 3,
                    image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729157998400-25dfc9.jpeg"
                },
                {
                    name: "Decorative fan installation",
                    rating: 4.80,
                    reviews: "548",
                    price: 99,
                    options: 3,
                    image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729157996551-d423bb.jpeg"
                },
                {
                    name: "Smart/BLDC fan installation",
                    rating: 4.81,
                    reviews: "9K",
                    price: 99,
                    options: 3,
                    image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1732778698362-740234.jpeg"
                }
            ]
        }
    ];

    const serviceCategories = [
        {
            label: "Cupboard & drawer",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1733309564400-0bcd21.jpeg",
        },
        {
            label: "Kichen fittings ",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1733231055964-be2fbe.jpeg",
        },
        {
            label: "Shelves & decor",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1726507335888-e0ff92.jpeg",
        },
        {
            label: "Bath fitting & mirrors",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1714126088173-046d75.jpeg",
        },
        {
            label: "Wooden door",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1726507333153-653b92.jpeg",
        },
        {
            label: "Window & curtain",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1726550802862-411248.jpeg",
        },
        {
            label: "Furniture repair",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1726507348146-3823dd.jpeg",
        },
        {
            label: "Clothes hanger",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1714126080285-6625fd.jpeg",
        }
        ,
        {
            label: "Book a consultation",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1700638213050-c722c8.jpeg",
        },
    ];

    return (
       <>
       <Header/>

        <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen px-4 md:px-7 gap-5 mt-10">
            
            <div className="w-full lg:w-92 bg-white p-4 md:p-6 lg:overflow-y-auto flex-shrink-0">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Carpenter</h1>
                    <div className="flex items-center gap-2 mt-2">
                         <svg width="8%" height="8%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18.333 10a8.333 8.333 0 11-16.667 0 8.333 8.333 0 0116.667 0zm-7.894-4.694A.476.476 0 009.999 5a.476.476 0 00-.438.306L8.414 8.191l-2.977.25a.48.48 0 00-.414.342.513.513 0 00.143.532l2.268 2.033-.693 3.039a.51.51 0 00.183.518.458.458 0 00.528.022L10 13.298l2.548 1.629a.458.458 0 00.527-.022.51.51 0 00.184-.518l-.693-3.04 2.268-2.032a.513.513 0 00.143-.532.48.48 0 00-.415-.342l-2.976-.25-1.147-2.885z" fill="#572AC8"></path></svg>
                        <span className="text-sm font-medium">4.80 (1.7 M bookings)</span>
                    </div>
                </div>

                <div className="mb-4 border border-gray-200 p-4 md:p-5 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-sm font-medium text-gray-600 whitespace-nowrap">
                            Select a service
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2">
                        {serviceCategories.map((cat, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center gap-2 p-2 md:p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                            >
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={cat.image}
                                        alt={cat.label}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-xs text-center text-gray-700">
                                    {cat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            
            <div className="flex-1 lg:overflow-y-auto">
                <div className="relative overflow-hidden mb-6 md:mb-10">
                    <img 
                        className='w-full lg:w-[65vw] rounded-lg' 
                        src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_873,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729160026655-645ab5.jpeg" 
                        alt="" 
                    />
                
                    <div className="absolute bottom-5 left-0 w-full lg:w-[65vw] h-1 bg-gray-200 z-10">
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

                
                <div className="flex flex-col lg:flex-row gap-6 px-0 md:px-8 pb-8 lg:border-t lg:border-l border-gray-200">
                   
                    <div className="flex-1 lg:pt-8 lg:border-r border-gray-200 lg:pr-8">
                        {services.map((section, idx) => (
                            <div key={idx} className="mb-8">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">{section.category}</h2>
                                {section.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="bg-white p-4 md:p-6 mb-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="flex-1 w-full">
                                            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Star className="w-4 h-4 fill-purple-600 text-purple-600" />
                                                <span className="text-sm font-medium">{item.rating}</span>
                                                <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
                                            </div>
                                            {item.description && (
                                                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="font-semibold text-gray-900">Starts at ₹{item.price}</span>
                                                {item.duration && <span className="text-gray-600">• {item.duration}</span>}
                                            </div>
                                            <button className="text-purple-600 text-sm font-medium mt-2 hover:underline">
                                                View details
                                            </button>
                                            {item.options && (
                                                <p className="text-xs text-gray-500 mt-2">{item.options} options</p>
                                            )}
                                        </div>
                                        <div className="flex sm:flex-col flex-row-reverse sm:items-end items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:ml-6">
                                            {item.image && (
                                                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <button className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition whitespace-nowrap">
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                  
                    <div className="w-full lg:w-80 lg:pt-8 flex-shrink-0 lg:sticky lg:top-0 lg:h-fit">
                        <div className="w-full space-y-6">
                          
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

                            
                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#05945B" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.75 8.5a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM14.75 15.5a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" fill="#05945B"></path>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm6.5-5.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm7 7a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-8.93 3.12l9.9-9.9 1.06 1.06-9.9 9.9-1.06-1.06z" fill="#05945B"></path>
                                        </svg>
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