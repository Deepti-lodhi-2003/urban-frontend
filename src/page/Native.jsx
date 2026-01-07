import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Header from "../component/Header"
import Footer from '../component/Footer';

export default function Native() {
    const [currentIndex1, setCurrentIndex1] = useState(0);
    const [currentIndex2, setCurrentIndex2] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const wallsSpaces = [
        {
            id: 1,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729585400527-2811fe.jpeg"
        },
        {
            id: 2,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729583343127-a159ca.jpeg"
        },
        {
            id: 3,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729583339154-821ff9.jpeg"
        },
        {
            id: 4,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729583334981-f0c81c.jpeg"
        },
        {
            id: 5,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729583330394-1ebbf7.jpeg"
        },
        {
            id: 6,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729583326489-57e778.jpeg"
        },
        {
            id: 7,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729583322295-78684a.jpeg"
        },
        {
            id: 8,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729583317252-43ca1f.jpeg"
        }
    ];

    const exploreSpaces = [
        {
            id: 1,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729582565075-6c8698.jpeg"
        },
        {
            id: 2,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729582588281-4d6e51.jpeg"
        },
        {
            id: 3,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729582583117-f3fe55.jpeg"
        },
        {
            id: 4,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729582579114-967873.jpeg"
        },
        {
            id: 5,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729582575130-a10178.jpeg"
        },
        {
            id: 6,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1729582569314-1e8653.jpeg"
        },
    ];

    const cardsToShow = isMobile ? 1 : 3;
    const maxIndex1 = wallsSpaces.length - cardsToShow;
    const maxIndex2 = exploreSpaces.length - cardsToShow;

    const nextSlide1 = () => {
        if (currentIndex1 < maxIndex1) {
            setCurrentIndex1(currentIndex1 + 1);
        }
    };

    const prevSlide1 = () => {
        if (currentIndex1 > 0) {
            setCurrentIndex1(currentIndex1 - 1);
        }
    };

    const nextSlide2 = () => {
        if (currentIndex2 < maxIndex2) {
            setCurrentIndex2(currentIndex2 + 1);
        }
    };

    const prevSlide2 = () => {
        if (currentIndex2 > 0) {
            setCurrentIndex2(currentIndex2 - 1);
        }
    };

    return (
        <>

            <Header />

            <div className="w-full bg-white py-8 md:py-12">
  <div className="max-w-[1400px] mx-auto lg:px-12">
    <div className="overflow-hidden shadow-sm cursor-pointer">
      <img 
        src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1766332205461-18c2b4.jpeg" 
        alt="Banner" 
        className="w-full h-auto transition-transform duration-300 ease-out hover:scale-[1.02]"
      />
    </div>
  </div>
</div>

            {/* First Slider - Beautiful walls */}
            <div className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 px-5">
                        <h2 className="text-4xl font-semibold text-gray-900">Best-in-class features</h2>
                    </div>

                    {/* Slider Container */}
                    <div className="relative px-5">
                        {/* Left Arrow */}
                        {currentIndex2 > 0 && (
                            <button
                                onClick={prevSlide2}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-700" />
                            </button>
                        )}

                        {/* Cards Container */}
                        <div className="overflow-hidden">
                            <div
                                className="flex gap-6 transition-transform duration-500 ease-out"
                                style={{ transform: `translateX(-${currentIndex2 * (100 / cardsToShow + (isMobile ? 0 : 2))}%)` }}
                            >
                                {exploreSpaces.map((space) => (
                                    <div
                                        key={space.id}
                                        className={`flex-shrink-0 ${isMobile ? 'w-full' : 'w-[calc(33.333%-16px)]'}`}
                                    >
                                        <div className="relative rounded-2xl overflow-hidden h-133 group cursor-pointer">
                                            {/* Background Image */}
                                            <img
                                                src={space.image}
                                                alt={space.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />

                                            {/* Title */}
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <h3 className="text-white text-2xl font-semibold">{space.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Arrow */}
                        {currentIndex2 < maxIndex2 && (
                            <button
                                onClick={nextSlide2}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-6 h-6 text-gray-700" />
                            </button>
                        )}
                    </div>
                </div>
            </div>



            <div className="w-full bg-white py-8 md:py-12">
  <div className="max-w-[1400px] mx-auto lg:px-12">
    <div className="overflow-hidden shadow-sm cursor-pointer">
      <img 
        src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1766332950494-9b1cf6.jpeg" 
        alt="Banner" 
        className="w-full h-auto transition-transform duration-300 ease-out hover:scale-[1.02]"
      />
    </div>
  </div>
</div>


            {/* Second Slider - Explore by space */}
            <div className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 px-5">
                        <h2 className="text-4xl font-semibold text-gray-900">All intelligent features</h2>
                    </div>

                    {/* Slider Container */}
                    <div className="relative px-5">
                        {/* Left Arrow */}
                        {currentIndex1 > 0 && (
                            <button
                                onClick={prevSlide1}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-700" />
                            </button>
                        )}

                        {/* Cards Container */}
                        <div className="overflow-hidden">
                            <div
                                className="flex gap-6 transition-transform duration-500 ease-out"
                                style={{ transform: `translateX(-${currentIndex1 * (100 / cardsToShow + (isMobile ? 0 : 2))}%)` }}
                            >
                                {wallsSpaces.map((space) => (
                                    <div
                                        key={space.id}
                                        className={`flex-shrink-0 ${isMobile ? 'w-full' : 'w-[calc(33.333%-16px)]'}`}
                                    >
                                        <div className="relative rounded-2xl overflow-hidden h-133 group cursor-pointer">
                                            {/* Background Image */}
                                            <img
                                                src={space.image}
                                                alt={space.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />

                                            {/* Title */}
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <h3 className="text-white text-2xl font-semibold">{space.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Arrow */}
                        {currentIndex1 < maxIndex1 && (
                            <button
                                onClick={nextSlide1}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-6 h-6 text-gray-700" />
                            </button>
                        )}
                    </div>
                </div>
            </div>


<div className="w-full bg-white py-8 md:py-12">
  <div className="max-w-[1400px] mx-auto lg:px-12">
    <div className="overflow-hidden shadow-sm cursor-pointer">
      <img 
        src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1748612847256-8e2681.jpeg" 
        alt="Banner" 
        className="w-full h-auto transition-transform duration-300 ease-out hover:scale-[1.02]"
      />
    </div>
  </div>
</div>

            <Footer />

        </>
    );
}