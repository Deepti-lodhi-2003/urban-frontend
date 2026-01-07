import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';

export default function SpaWomenSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const services = [
        {
            id: 1,
            name: "Warm Swedish stress relief massage",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1766569598956-6d690e.jpeg",
            rating: 4.83,
            reviews: "5K",
            price: 1349,
            originalPrice: null,
            badge: "Hot bed"
        },
        {
            id: 2,
            name: "4 sessions (Mon-Sat only): Swedish massage",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1763038402712-93a031.jpeg",
            rating: 4.82,
            reviews: "228K",
            price: 1299,
            originalPrice: null,
            badge: null
        },
        {
            id: 3,
            name: "Warm deep tissue pain relief massage",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1766569602230-c2b76a.jpeg",
            rating: 4.84,
            reviews: "5K",
            price: 1499,
            originalPrice: null,
            badge: "Hot bed"
        },
        {
            id: 4,
            name: "4 sessions (Mon-Sat only): Deep tissue massage",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1763038600373-5567e3.jpeg",
            rating: 4.82,
            reviews: "154K",
            price: 1449,
            originalPrice: null,
            badge: null
        },
        {
            id: 5,
            name: "Leg pain relief massage for women",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1764927910031-575580.jpeg",
            rating: 4.85,
            reviews: "12K",
            price: 849,
            originalPrice: null,
            badge: null
        }
    ];

    const cardsToShow = isMobile ? 2 : 5;
    const maxIndex = services.length - cardsToShow;

    const nextSlide = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const getVisibleCards = () => {
        const visible = [];
        for (let i = 0; i < cardsToShow; i++) {
            if (currentIndex + i < services.length) {
                visible.push(services[currentIndex + i]);
            }
        }
        return visible;
    };

    return (
        <div className="w-full bg-white py-8 md:py-12">
            <div className="max-w-[1400px] mx-auto px-4">
                {/* Header */}
                <div className="mb-6 md:mb-8 px-1 md:px-2 flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">
                            Spa for Women
                        </h2>
                    </div>
                    <button className="text-purple-700 font-semibold text-sm md:text-base hover:text-purple-800 border border-gray-300 rounded-lg px-4 py-2 hover:bg-purple-50 transition-colors">
                        See all
                    </button>
                </div>

                {/* Slider Container */}
                <div className="relative">
                    {/* Left Arrow */}
                    {currentIndex > 0 && (
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 md:-left-2 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-2 z-30 bg-white rounded-full p-2 md:p-3 shadow-lg md:shadow-2xl hover:shadow-xl transition-all border border-gray-300 hover:border-gray-400"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
                        </button>
                    )}

                    {/* Cards Container */}
                                        <div className="px-0 md:px-8">
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                                                {getVisibleCards().map((service) => (
                                                    <div
                                                        key={service.id}
                                                        className="cursor-pointer transition-all duration-300 group"
                                                    >
                                                        {/* Image Container */}
                                                        <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-gray-100">
                                                            <div className="w-full aspect-[4/3]">
                                                                <img
                                                                    src={service.image}
                                                                    alt={service.name}
                                                                    className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                />
                                                            </div>
                                                        </div>
                    
                                                        {/* Text Container */}
                                                        <div className="pt-2 md:pt-3">
                                                            <h3 className="text-xs md:text-base font-semibold text-gray-900 line-clamp-2 mb-1 md:mb-2">
                                                                {service.name}
                                                            </h3>
                    
                                                            {/* Rating */}
                                                            <div className="flex items-center gap-1 mb-1 md:mb-2">
                                                                <Star className="w-2 h-2 md:w-3 md:h-3 fill-gray-600 text-gray-600" />
                                                                <span className="text-xs md:text-sm text-gray-600">
                                                                    {service.rating}
                                                                </span>
                                                                <span className="text-xs text-gray-700">
                                                                    ({service.reviews})
                                                                </span>
                                                            </div>  
                    
                                                            {/* Price */}
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm md:text-base text-gray-700">
                                                                    ₹{service.price}
                                                                </span>
                                                                {service.originalPrice && (
                                                                    <span className="text-xs md:text-sm text-gray-500 line-through">
                                                                        ₹{service.originalPrice}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                    {/* Right Arrow */}
                    {currentIndex < maxIndex && (
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 md:right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-2 z-30 bg-white rounded-full p-2 md:p-3 shadow-lg md:shadow-2xl hover:shadow-xl transition-all border border-gray-300 hover:border-gray-400"
                        >
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}