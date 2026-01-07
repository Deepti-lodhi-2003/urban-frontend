import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchServices, getImageUrl } from './Api';

export default function Slider2() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [services, setServices] = useState([[], []]);
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
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchServices({
          page: 1,
          limit: 12
        });

        if (response.success && response.data?.services) {
          const fetchedServices = response.data.services;
          
          const row1 = fetchedServices.slice(0, 6).map(service => ({
            id: service._id,
            name: service.name,
            image: service.images && service.images.length > 0 
              ? getImageUrl(service.images[0]) 
              : 'https://via.placeholder.com/233x160?text=No+Image',
            badge: service.discountPrice && service.discountPrice < service.price,
            categoryName: service.category?.name || 'service'
          }));

          const row2 = fetchedServices.slice(6, 12).map(service => ({
            id: service._id,
            name: service.name,
            image: service.images && service.images.length > 0 
              ? getImageUrl(service.images[0]) 
              : 'https://via.placeholder.com/233x160?text=No+Image',
            badge: service.discountPrice && service.discountPrice < service.price,
            categoryName: service.category?.name || 'service'
          }));

          setServices([row1, row2]);
        }
      } catch (err) {
        console.error('Error loading services:', err);
        setError('Failed to load services');
      
        // Fallback data with proper navigation setup
        setServices([
          [
            {
              id: "1",
              name: "Insta Help",
              image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1753434354721-c43063.jpeg",
              badge: true,
              categoryName: "insta-help"
            },
            {
              id: "2",
              name: "Wall makeover by Revamp",
              image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1756203838559-d0c8f7.jpeg",
              badge: false,
              categoryName: "wall-makeover"
            },
            {
              id: "3",
              name: "Electrician",
              image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1752218402829-d65a4e.jpeg",
              badge: true,
              categoryName: "electrician"
            },
            {
              id: "4",
              name: "Native Water Purifier",
              image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1752476639421-112dfa.jpeg",
              badge: false,
              categoryName: "water-purifier"
            },
            {
              id: "5",
              name: "Carpenter",
              image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1752218411748-937dff.jpeg",
              badge: true,
              categoryName: "carpenter"
            },
            {
              id: "6",
              name: "Native Smart Locks",
              image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1723808286533-2d276b.jpeg",
              badge: false,
              categoryName: "smart-locks"
            }
          ],
          [
            {
              id: "7",
              name: "Kitchen Cleaning",
              image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1755078161219-e4f32a.jpeg",
              badge: false,
              categoryName: "kitchen-cleaning"
            },
            {
              id: "8",
              name: "Living & Bedroom Cleaning",
              image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1653227410328-5bcbe0.png",
              badge: true,
              categoryName: "bedroom-cleaning"
            },
            {
              id: "9",
              name: "Laptop",
              image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1752218390706-449571.jpeg",
              badge: false,
              categoryName: "laptop"
            },
            {
              id: "10",
              name: "Wood Polish",
              image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1758611464368-71226b.jpeg",
              badge: true,
              categoryName: "wood-polish"
            },
            {
              id: "11",
              name: "Spa Ayurveda",
              image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1752218379388-cbe3e2.jpeg",
              badge: false,
              categoryName: "spa-ayurveda"
            },
            {
              id: "12",
              name: "Hair studio for women",
              image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1651040420198-fe6d1d.jpeg",
              badge: false,
              categoryName: "hair-studio"
            }
          ]
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const cardsToShow = isMobile ? 2 : 5;
  const maxIndex = services[0].length - cardsToShow;

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

  const getVisibleCards = (rowIndex) => {
    const visible = [];
    for (let i = 0; i < cardsToShow; i++) {
      if (currentIndex + i < services[rowIndex].length) {
        visible.push(services[rowIndex][currentIndex + i]);
      }
    }
    return visible;
  };

  const handleCardClick = (service) => {
    // Convert service name to URL-friendly format
    const urlFriendlyName = service.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Navigate to details page with service ID and name in URL
    navigate(`/service/${urlFriendlyName}/${service.id}`);
  };

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
            New and noteworthy
          </h2>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('Using fallback data due to API error:', error);
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
          New and noteworthy
        </h2>

        <div className="relative">
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all duration-200 -ml-4"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
          )}

          <div className="overflow-hidden">
            {[0, 1].map((rowIndex) => (
              <div
                key={rowIndex}
                className="flex gap-4 mb-4 transition-transform duration-500 ease-in-out"
              >
                {getVisibleCards(rowIndex).map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleCardClick(service)}
                    className="cursor-pointer transition-all duration-300 group"
                    style={{
                      minWidth: isMobile ? 'calc(50% - 8px)' : 'calc(20% - 12.8px)',
                      maxWidth: isMobile ? 'calc(50% - 8px)' : 'calc(20% - 12.8px)'
                    }}
                  >
                    <div className="relative overflow-hidden rounded-xl mb-2">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      {service.badge && (
                        <span className="absolute top-2 left-2 bg-white text-purple-600 text-xs font-bold px-2 py-1 rounded">
                          NEW
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                      {service.name}
                    </h3>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {currentIndex < maxIndex && (
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all duration-200 -mr-4"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}