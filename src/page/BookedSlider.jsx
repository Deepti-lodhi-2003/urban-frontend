import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { fetchServices, getImageUrl, formatPrice } from './Api'; 

export default function BookedSlider() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchServices({
        page: 1,
        limit: 10,
      });

      if (response.success && response.data.services) {
        setServices(response.data.services);
      } else {
        setError('No services found');
      }
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (service) => {
    const urlFriendlyName = service.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    navigate(`/service/${urlFriendlyName}/${service._id}`);
  };

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

  if (loading) {
    return (
      <div className="w-full bg-white py-8 md:py-12">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="mb-6 md:mb-8 px-1 md:px-2">
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">Most booked services</h2>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white py-8 md:py-12">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="mb-6 md:mb-8 px-1 md:px-2">
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">Most booked services</h2>
          </div>
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={loadServices}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="w-full bg-white py-8 md:py-12">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="mb-6 md:mb-8 px-1 md:px-2">
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">Most booked services</h2>
          </div>
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">No services available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-8 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="mb-6 md:mb-8 px-1 md:px-2">
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">Most booked services</h2>
        </div>

        <div className="relative">
       
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 md:-left-2 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-2 z-30 bg-white rounded-full p-2 md:p-3 shadow-lg md:shadow-2xl hover:shadow-xl transition-all border border-gray-300 hover:border-gray-400"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
            </button>
          )}

          <div className="px-0 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              {getVisibleCards().map((service) => (
                <div
                  key={service._id}
                  onClick={() => handleCardClick(service)}
                  className="cursor-pointer transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-gray-100">
                    <div className="w-full aspect-[4/3]">
                      <img
                        src={getImageUrl(service.images?.[0])}
                        alt={service.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x225?text=No+Image';
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 md:pt-3">
                    <h3 className="text-xs md:text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-1 md:mb-2">
                      {service.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-1 md:mb-2">
                      <Star className="w-2 h-2 md:w-3 md:h-3 fill-gray-600 text-gray-600" />
                      <span className="text-xs md:text-sm text-gray-600">
                        {service.rating || 'N/A'}
                      </span>
                      <span className="text-xs text-gray-700">
                        ({service.totalReviews || 0})
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm md:text-base text-gray-700">
                        ₹{service.discountPrice || service.price}
                      </span>
                      {service.discountPrice && service.price && service.discountPrice < service.price && (
                        <span className="text-xs md:text-sm text-gray-500 line-through">
                          ₹{service.price}
                        </span>
                      )}
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
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}