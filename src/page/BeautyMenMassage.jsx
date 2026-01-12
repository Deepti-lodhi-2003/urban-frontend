import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BeautyMenMassage() {
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
      title: "Pain relief",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_231,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1700135813754-417df5.jpeg"
    },
    {
      id: 2,
      title: "Stress relief",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_231,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1700135826199-2ae5f2.jpeg"
    },
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
     
        <div className='pl-7 mb-9'>
                        <div className="mb-2 md:mb-3 px-1 md:px-2">
                            <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">
                                Massage for Men
                            </h2>
                        </div>
                        <p className="text-sm md:text-base text-gray-600 pl-2">
                           Curated massages by top therapists.
                        </p>
                    </div>


        <div className="relative">

          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 md:-left-2 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-2 z-30 bg-white rounded-full p-2 md:p-3 shadow-lg md:shadow-2xl hover:shadow-xl transition-all border border-gray-300 hover:border-gray-400"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
            </button>
          )}

          <div className="px-0 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              {getVisibleCards().map((service) => (
                <div
                  key={service.id}
                  className="cursor-pointer transition-all duration-300 group"
                >
                  <div className="rounded-lg md:rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-all duration-300">
                 
                    <div className="p-4 md:p-6 bg-white min-h-[40px] md:min-h-[60px] flex items-center">
                      <h3 className="text-sm md:text-lg font-normal text-gray-900">
                        {service.title}
                      </h3>
                    </div>
                    
                    <div className="relative overflow-hidden">
                      <div className="w-full h-48 md:h-50">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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