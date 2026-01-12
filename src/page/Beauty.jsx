import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../component/Footer';
import Header from '../component/Header';
import BeautyBookedService from './BeautyBookedService';
import BeautyWomenSalon from './BeautyWomenSalon';
import BeautyWomenSpa from './BeautyWomenSpa';
import BeautyHairService from './BeautyHairService';
import BeautyMenSalon from './BeautyMenSalon';
import BeautyMenMassage from './BeautyMenMassage';

export default function Beauty() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1712901363859-410ccb.jpeg"
    },
    {
      id: 2,
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1749719167789-a2e4a9.jpeg"
    },
    {
      id: 3,
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1711428187463-abb19d.jpeg"
    },
    {
      id: 4,
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1711428209166-2d42c0.jpeg"
    },
    {
      id: 5,
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1711428163831-860972.jpeg"
    },
    {
      id: 6,
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1749719177066-6bd9be.jpeg"
    },
  ];

  const services = [
    {
      id: 1,
      name: "Salon for Women",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1672324465583-2688a9.jpeg",
      badge: null
    },
    {
      id: 2,
      name: "Spa for Women",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1673936988512-276a19.jpeg",
      badge: null
    },
    {
      id: 3,
      name: "Hair Studio for Women",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1728839468364-90b0dc.jpeg",
      badge: null
    },
    {
      id: 4,
      name: "Makeup & Styling Studio",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1669023257508-ffd582.jpeg",
      badge: null
    },
    {
      id: 5,
      name: "Salon Prime",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1710241114433-5cfa7c.jpeg",
      badge: null
    },
    {
      id: 6,
      name: "Message for Men",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1674623814769-eeca92.jpeg",
      badge: null
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const getVisibleSlides = () => {
    const visible = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 1 : 3;
    for (let i = 0; i < count; i++) {
      visible.push(slides[(currentIndex + i) % slides.length]);
    }
    return visible;
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>

<Header/>

    <div className="min-h-screen bg-white pt-7">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          <div className="w-full flex flex-col">
            <div className="mb-6 md:mb-8 px-1 md:px-2">
              <h1 className="text-2xl md:text-4xl font-semibold text-gray-900">
                Beauty services at your<br />doorstep
              </h1>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex-1 w-full sm:w-auto">
              <h2 className="text-lg font-semibold text-gray-700 mb-6">
                What are you looking for?
              </h2>

              <div className="grid grid-cols-3 sm:grid-cols-3 gap-5">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="relative transition-all group"
                  >
                    {service.badge && (
                      <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded z-10">
                        {service.badge}
                      </span>
                    )}
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-3 rounded-lg py-4 px-4 hover:bg-gray-200 cursor-pointer w-full flex items-center justify-center bg-gray-100">
                        <img src={service.image} alt={service.name} className="w-14 h-14 object-contain" />
                      </div>
                      <p className="text-xs font-medium text-gray-700 leading-tight">
                        {service.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="flex items-center gap-10 sm:gap-18 mt-12">
              <div className="flex items-center gap-3">
                <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_48,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1693570188661-dba2e7.jpeg" alt="Rating" className="w-12 h-12" />
                <div>
                  <div className="text-xl font-semibold text-gray-900">4.8</div>
                  <div className="text-sm text-gray-600">Service Rating*</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_48,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1693491890812-e86755.jpeg" alt="Customers" className="w-12 h-12" />
                <div>
                  <div className="text-xl font-semibold text-gray-900">12M+</div>
                  <div className="text-sm text-gray-600">Customers Globally*</div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block h-[590px]">
            <img
              src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1719293199714-da733e.jpeg"
              alt="Women's Salon"
              className="w-full h-full object-cover rounded-2xl min-h-[550px]"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="w-full bg-white lg:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8 px-1 md:px-2">
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">In the spotlight</h2>
        </div>
        
        <div className="relative">
        
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
          )}

        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getVisibleSlides().map((slide, idx) => (
              <div
                key={`${slide.id}-${idx}`}
                className="rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-2xl group"
              >
                <img
                  src={slide.image}
                  alt={`Slide ${slide.id}`}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>

          {currentIndex < slides.length - (isMobile ? 1 : 3) && (
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </div>
      </div>
    </div>

    <BeautyBookedService/>

    <BeautyWomenSalon/>

    <div className="w-full bg-white py-8 md:py-12">
  <div className="max-w-[1400px] mx-auto lg:px-12">
    <div className="overflow-hidden shadow-sm cursor-pointer">
      <img 
        src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1698216798701-9a08f0.jpeg" 
        alt="Banner" 
        className="w-full h-auto transition-transform duration-300 ease-out hover:scale-[1.02]"
      />
    </div>
  </div>
</div>

<BeautyWomenSpa/>

<BeautyHairService/>

  <div className="w-full bg-white py-8 md:py-12">
  <div className="max-w-[1400px] mx-auto lg:px-12">
    <div className="overflow-hidden shadow-sm cursor-pointer">
      <img 
        src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1698216790006-967dd6.jpeg" 
        alt="Banner" 
        className="w-full h-auto transition-transform duration-300 ease-out hover:scale-[1.02]"
      />
    </div>
  </div>
</div>

<BeautyMenSalon/>

<div className="w-full bg-white py-8 md:py-12">
  <div className="max-w-[1400px] mx-auto lg:px-12">
    <div className="overflow-hidden shadow-sm cursor-pointer">
      <img 
        src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1698216827166-bc6957.jpeg" 
        alt="Banner" 
        className="w-full h-auto transition-transform duration-300 ease-out hover:scale-[1.02]"
      />
    </div>
  </div>
</div>

<BeautyMenMassage/>

<Footer/>
    </>
  );
}