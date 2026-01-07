import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';

export default function BeautyHairService() {
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
            name: "In curl/out curl blow-dry",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1734607570661-a50907.jpeg",
            rating: 4.81,
            reviews: "52K",
            price: 399
        },
        {
            id: 2,
            name: "Straight & smooth blow-dry",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1760091051261-1879a7.jpeg",
            rating: 4.86,
            reviews: "53K",
            price: 399
        },
        {
            id: 3,
            name: "Basic makeup package",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1760091013347-87620a.jpeg",
            rating: 4.70,
            reviews: "13K",
            price: 2099
        },
        {
            id: 4,
            name: "Basic makeup",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1732010890450-57eb78.jpeg",
            rating: 4.71,
            reviews: "7K",
            price: 1599
        },
        {
            id: 5,
            name: "Haircut for women",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1762946937795-89dcaa.jpeg",
            rating: 4.83,
            reviews: "114K",
            price: 549
        },
        // Second Row
        {
            id: 6,
            name: "Hair colour (application only)",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1762946941523-faef6e.jpeg",
            rating: 4.81,
            reviews: "34K",
            price: 399
        },
        {
            id: 7,
            name: "L'Oréal Inoa root touch-up",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1653643385578-9aa8aa.png",
            rating: 4.73,
            reviews: "16K",
            price: 1299
        },
        {
            id: 8,
            name: "HD finish makeup",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1732010878073-a8612e.jpeg",
            rating: 4.70,
            reviews: "3K",
            price: 2499
        },
        {
            id: 9,
            name: "Luxe makeup package",
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1732038533601-5abf14.jpeg",
            rating: 4.67,
            reviews: "2K",
            price: 3799
        },
    ];

    const cardsToShow = isMobile ? 2 : 5;
    const rowsToShow = 2; // 2 rows
    const cardsPerPage = cardsToShow * rowsToShow; // 5 cards × 2 rows = 10 cards per page
    const maxIndex = Math.ceil(services.length / cardsPerPage) - 1;

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
        const startIdx = currentIndex * cardsPerPage;
        const endIdx = startIdx + cardsPerPage;
        return services.slice(startIdx, endIdx);
    };

    return (
        <div className="w-full bg-white py-8 md:py-12">
            <div className="max-w-[1400px] mx-auto px-4">
                {/* Header */}
                <div className="mb-6 md:mb-8 px-1 md:px-9 flex items-start justify-between">
                    <div className=''>
                        <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">
                            Hair services
                        </h2>
                        <p className="text-sm md:text-base text-gray-600 mt-1">
                            Refreshed style, revamped look
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

                    {/* Cards Container - 2 Rows */}
                    <div className="px-0 md:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 grid-rows-2">
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