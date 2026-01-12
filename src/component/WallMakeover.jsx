import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Header from "../component/Header"
import Footer from '../component/Footer';

export default function WallMakeover() {
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
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1764249386367-b90680.jpeg"
        },
        {
            id: 2,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1764249382911-dca385.jpeg"
        },
        {
            id: 3,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1764249371877-40a01e.jpeg"
        },
        {
            id: 4,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1764249392296-9f2600.jpeg"
        },
        {
            id: 5,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1764249379715-790ec1.jpeg"
        },
        {
            id: 6,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1764249389401-6e8236.jpeg"
        },
        {
            id: 7,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1764249375554-4ce688.jpeg"
        },
    ];

    const exploreSpaces = [
        {
            id: 1,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1764057222615-8300af.jpeg"
        },
        {
            id: 2,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1766748883016-261df6.jpeg"
        },
        {
            id: 3,
            image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1766748885791-0bb590.jpeg"
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

<Header/>

        
            <div className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                
                    <div className="mb-8 px-5">
                        <h2 className="text-4xl font-semibold text-gray-900">Explore by product</h2>
                    </div>

                 
                    <div className="relative px-5">
                     
                        {currentIndex2 > 0 && (
                            <button
                                onClick={prevSlide2}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-700" />
                            </button>
                        )}

                      
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
                                           
                                            <img
                                                src={space.image}
                                                alt={space.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />

                                         
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <h3 className="text-white text-2xl font-semibold">{space.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                      
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


          
            <div className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
               
                    <div className="mb-8 px-5">
                        <h2 className="text-4xl font-semibold text-gray-900">In the spotlight</h2>
                    </div>

               
                    <div className="relative px-5">
                    
                        {currentIndex1 > 0 && (
                            <button
                                onClick={prevSlide1}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-700" />
                            </button>
                        )}

                     
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
                                         
                                            <img
                                                src={space.image}
                                                alt={space.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />

                                         
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <h3 className="text-white text-2xl font-semibold">{space.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    
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


            <Footer/>

        </>
    );
}