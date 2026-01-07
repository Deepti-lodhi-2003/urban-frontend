import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';

export default function SalonForMen() {
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
            name: "Haircut for men",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_186,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1753178331803-9c6a1f.jpeg",
            rating: 4.83,
            reviews: "5K",
            price: 259,
            originalPrice: null
        },
        {
            id: 2,
            name: "Haircut for kids",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_186,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1727774913314-882542.jpeg",
            rating: 4.82,
            reviews: "228K",
            price: 259,
            originalPrice: null,
            badge: null
        },
        {
            id: 3,
            name: "Head, neck & shoulder massage",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_186,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1749642965077-53be02.jpeg",
            rating: 4.84,
            reviews: "5K",
            price: 299,
            originalPrice: null
        },
        {
            id: 4,
            name: "Brightening lemon express pedicure",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_186,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1754494095509-d727f7.jpeg",
            rating: 4.82,
            reviews: "154K",
            price: 549,
            originalPrice: null,
            badge: null
        },
        {
            id: 5,
            name: "Brightening lemon deep cleanse pedicure ",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_186,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1677522040981-6955eb.jpeg",
            rating: 4.85,
            reviews: "12K",
            price: 799,
            originalPrice: null,
            badge: null
        },
        {
            id: 6,
            name: "Apartment termite control",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729772247309-29d7b5.jpeg",
            rating: 4.82,
            reviews: "228K",
            price: 1199,
            originalPrice: null,
            badge: null
        },
         {
            id: 7,
            name: "Dining table & chairs cleaning",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1754031046739-573802.jpeg",
            rating: 4.82,
            reviews: "228K",
            price: 1199,
            originalPrice: null,
            badge: null
        },
         {
            id: 8,
            name: "Bed bugs control",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1652173244440-fbfe7b.png",
            rating: 4.82,
            reviews: "228K",
            price: 1199,
            originalPrice: null,
            badge: null
        },
         {
            id: 9,
            name: "Intense cleaning (3 bathrooms)",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1659102409372-8ca38a.png",
            rating: 4.82,
            reviews: "228K",
            price: 1199,
            originalPrice:1557,
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
                        <div className="mb-2 md:mb-3 px-1 md:px-2">
                            <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">
                                Salon for Men
                            </h2>
                        </div>
                        <p className="text-sm md:text-base text-gray-600">
                            Grooming essentials
                        </p>
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