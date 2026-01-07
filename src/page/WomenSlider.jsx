import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';

export default function WomenSlider() {
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
            name: "Roll-on waxing (Full arms, legs & underarms)",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1760094248189-76c77f.jpeg",
            rating: 4.87,
            reviews: "60K",
            price: 899,
            originalPrice: null,
            discount: null
        },
        {
            id: 2,
            name: "Spatula waxing (Full arms, legs & underarms)",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1762854318222-623071.jpeg",
            rating: 4.86,
            reviews: "39K",
            price: 699,
            originalPrice: null,
            discount: null
        },
        {
            id: 3,
            name: "Crystal rose pedicure",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1763038614950-13e09b.jpeg",
            rating: 4.83,
            reviews: "129K",
            price: 759,
            originalPrice: null,
            discount: null
        },
        {
            id: 4,
            name: "Mani-pedi delight",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1760111132977-b6811a.jpeg",
            rating: 4.82,
            reviews: "186K",
            price: 1359,
            originalPrice: 1450,
            discount: "7% OFF"
        },
        {
            id: 5,
            name: "Classic pedicure",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1631695731413-2431d2.jpeg",
            rating: 4.83,
            reviews: "129K",
            price: 649,
            originalPrice: null,
            discount: null
        },
        {
            id: 6,
            name: "Chocolate pedicure",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1631695734424-bb4e4f.jpeg",
            rating: 4.83,
            reviews: "129K",
            price: 799,
            originalPrice: null,
            discount: null
        }
    ];

    const cardsToShow = isMobile ? 2 : 4;
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
                                Salon for Women
                            </h2>
                        </div>
                        <p className="text-sm md:text-base text-gray-600">
                            Pamper yourself at home
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
                                    <div className="relative overflow-hidden rounded-t-lg">
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        {/* Discount Badge */}
                                        {service.discount && (
                                            <div className="absolute top-0 left-2 md:left-3 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-1 md:py-1.4 z-10"
                                                style={{
                                                    backgroundColor: "rgba(7, 121, 76, 1.00)",
                                                    borderBottomLeftRadius: "4px",
                                                    borderBottomRightRadius: "4px"
                                                }}>
                                                {service.discount}
                                            </div>
                                        )}
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