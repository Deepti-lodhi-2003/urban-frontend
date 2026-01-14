import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../component/Footer';
import Header from '../component/Header';
import BeautyBookedService from './BeautyBookedService';
import BeautyWomenSalon from './BeautyWomenSalon';
import BeautyWomenSpa from './BeautyWomenSpa';
import BeautyHairService from './BeautyHairService';
import BeautyMenSalon from './BeautyMenSalon';
import BeautyMenMassage from './BeautyMenMassage';
import { fetchCategories, fetchServices, getImageUrl } from './Api';

export default function Beauty() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [beautyCategories, setBeautyCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spotlightLoading, setSpotlightLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Beauty related keywords for filtering
  const beautyKeywords = [
    'salon', 'spa', 'beauty', 'makeup', 'hair', 'facial', 
    'massage', 'waxing', 'manicure', 'pedicure', 'styling',
    'threading', 'bleach', 'clean up', 'women', 'men'
  ];

  useEffect(() => {
    loadCategories();
    loadBeautySpotlight();
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetchCategories();
      
      if (response.success && response.data) {
        const activeCategories = response.data
          .filter(cat => cat.isActive)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        
        setCategories(activeCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBeautySpotlight = async () => {
    try {
      setSpotlightLoading(true);
      const response = await fetchCategories();
      
      if (response.success && response.data) {
        // Filter only beauty-related categories
        const beautyRelated = response.data.filter(cat => {
          if (!cat.isActive) return false;
          
          const name = cat.name.toLowerCase();
          const desc = (cat.description || '').toLowerCase();
          
          return beautyKeywords.some(keyword => 
            name.includes(keyword) || desc.includes(keyword)
          );
        }).sort((a, b) => (a.order || 0) - (b.order || 0));
        
        setBeautyCategories(beautyRelated);
      }
    } catch (error) {
      console.error('Error loading beauty categories:', error);
      setBeautyCategories([]);
    } finally {
      setSpotlightLoading(false);
    }
  };

  const handleCategoryClick = async (category) => {
    try {
      const response = await fetchServices({
        category: category._id,
        limit: 1
      });

      if (response.success && response.data && response.data.services && response.data.services.length > 0) {
        const firstService = response.data.services[0];
        
        const urlFriendlyName = firstService.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        window.location.href = `/service/${urlFriendlyName}/${firstService._id}`;
      } else {
        console.log('No services available for this category');
        alert('No services available for this category at the moment.');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Unable to load services. Please try again.');
    }
  };

  const handleSpotlightClick = (category) => {
    const urlFriendlyName = category.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    window.location.href = `/category/${urlFriendlyName}/${category._id}`;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % beautyCategories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + beautyCategories.length) % beautyCategories.length);
  };

  const getVisibleSlides = () => {
    if (beautyCategories.length === 0) return [];
    
    const visible = [];
    const count = isMobile ? 1 : 3;
    
    for (let i = 0; i < count; i++) {
      visible.push(beautyCategories[(currentIndex + i) % beautyCategories.length]);
    }
    
    return visible;
  };

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

                {loading ? (
                  <div className="grid grid-cols-3 gap-5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-full h-20 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
                        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No categories available at the moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-5">
                    {categories.map((category) => (
                      <div
                        key={category._id}
                        className="relative transition-all group cursor-pointer"
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category.badge && (
                          <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded z-10">
                            {category.badge}
                          </span>
                        )}
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="mb-3 rounded-lg py-4 px-4 hover:bg-gray-200 cursor-pointer w-full flex items-center justify-center bg-gray-100">
                            <img 
                              src={getImageUrl(category.image)} 
                              alt={category.name} 
                              className="w-14 h-14 object-contain"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/56?text=Service';
                              }}
                            />
                          </div>
                          <p className="text-xs font-medium text-gray-700 leading-tight">
                            {category.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* In the Spotlight - Beauty Categories Only */}
      <div className="w-full bg-white lg:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8 px-1 md:px-2">
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">In the spotlight</h2>
          </div>
          
          {spotlightLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : beautyCategories.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No beauty services available at the moment.</p>
            </div>
          ) : (
            <div className="relative">
              {currentIndex > 0 && (
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getVisibleSlides().map((category, idx) => (
                  <div
                    key={`${category._id}-${idx}`}
                    onClick={() => handleSpotlightClick(category)}
                    className="rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-2xl group"
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(category.image)}
                        alt={category.name}
                        className="w-full h-auto aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/394x295/e2e8f0/64748b?text=Beauty+Service';
                        }}
                      />
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white font-semibold text-lg">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-white/90 text-sm mt-1 line-clamp-1">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {currentIndex < beautyCategories.length - (isMobile ? 1 : 3) && (
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              )}
            </div>
          )}

          {beautyCategories.length > (isMobile ? 1 : 3) && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ 
                length: Math.ceil(beautyCategories.length - (isMobile ? 0 : 2)) 
              }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx 
                      ? 'bg-purple-600 w-8' 
                      : 'bg-gray-300 w-2 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BeautyBookedService/>

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

      <BeautyWomenSalon/>

      

      {/* <BeautyWomenSpa/> */}
      {/* <BeautyHairService/> */}

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

      {/* <BeautyMenMassage/> */}
      <Footer/>
    </>
  );
}