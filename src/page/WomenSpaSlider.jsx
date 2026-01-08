import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchServices, fetchCategories, getImageUrl } from './Api';

export default function SpaWomenSlider() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState('');

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const loadWomenSpaServices = async () => {
            try {
                setError(null);
                setDebugInfo('Starting to fetch categories...');
                
                
                const categoriesResponse = await fetchCategories();
                console.log(' Categories Response:', categoriesResponse);
                setDebugInfo(`Categories fetched: ${JSON.stringify(categoriesResponse)}`);
                
                
                if (!categoriesResponse || !categoriesResponse.success || !categoriesResponse.data) {
                    console.error(' No categories found or API failed');
                    setDebugInfo('Categories API failed or returned no data');
                    throw new Error('Categories not available');
                }
                
                
                console.log(' All Categories:', categoriesResponse.data.map(cat => cat.name));
                
               
                let categoryId = null;
                const womenCategory = categoriesResponse.data.find(cat => {
                    const name = cat.name.toLowerCase();
                    return name.includes('women') || 
                           name.includes('salon') ||
                           name.includes('spa') ||
                           name.includes('beauty');
                });
                
                if (womenCategory) {
                    categoryId = womenCategory._id;
                    console.log(' Found category:', womenCategory.name, 'ID:', categoryId);
                    setDebugInfo(`Using category: ${womenCategory.name}`);
                } else {
                    console.log(' No matching category found. Available categories:', 
                        categoriesResponse.data.map(cat => cat.name).join(', '));
                    setDebugInfo(`No matching category. Available: ${categoriesResponse.data.map(cat => cat.name).join(', ')}`);
                }
                
             
                let fetchedServices = [];
                
                if (categoryId) {
                    console.log(' Fetching services by category ID:', categoryId);
                    const response = await fetchServices({
                        page: 1,
                        limit: 50,  
                        category: categoryId
                    });
                    
                    console.log(' Services Response:', response);
                    
                    if (response.success && response.data?.services) {
                        fetchedServices = response.data.services;
                        console.log(` Found ${fetchedServices.length} services`);
                    } else {
                        console.log(' No services in category response');
                    }
                }
                
              
                if (fetchedServices.length < 5) {
                    console.log(' Too few services from category, trying search...');
                   
                    console.log(' Using search fallback...');
                    const searchTerms = ['massage', 'spa', 'facial', 'salon'];
                    let allServices = [];
                    
                    for (const term of searchTerms) {
                        try {
                            console.log(`Searching for: ${term}`);
                            const response = await fetchServices({
                                page: 1,
                                limit: 20,
                                search: term
                            });
                            
                            if (response.success && response.data?.services) {
                                console.log(` Found ${response.data.services.length} services for "${term}"`);
                                allServices = [...allServices, ...response.data.services];
                            }
                        } catch (err) {
                            console.log(` No results for: ${term}`);
                        }
                    }
                    
                    
                    fetchedServices = Array.from(
                        new Map(allServices.map(service => [service._id, service])).values()
                    );
                    console.log(` Total unique services: ${fetchedServices.length}`);
                }
                
                console.log('Total services found:', fetchedServices.length);
                
                if (fetchedServices.length > 0) {
                    const formattedServices = fetchedServices
                        .filter(service => {
                            const hasImage = service.images && Array.isArray(service.images) && service.images.length > 0;
                            if (!hasImage) {
                                console.log(` Skipping service without image: ${service.name}`);
                            }
                            return hasImage;
                        })
                        .slice(0, 12)
                        .map(service => {
                            console.log(` Adding service: ${service.name}`);
                            return {
                                id: service._id,
                                name: service.name,
                                image: getImageUrl(service.images[0]),
                                rating: service.rating || 4.8,
                                reviews: service.totalReviews ? `${(service.totalReviews / 1000).toFixed(0)}K` : '0',
                                price: service.discountPrice || service.price,
                                originalPrice: service.discountPrice ? service.price : null,
                                badge: null
                            };
                        });
                    
                    console.log(' Final services to display:', formattedServices.length);
                    setServices(formattedServices);
                    setDebugInfo(`Loaded ${formattedServices.length} services successfully`);
                    return;
                }
                
                console.log(' No services found, using fallback data');
                throw new Error('No spa services found');
                
            } catch (err) {
                console.error(' Error:', err);
                setError(err.message || 'Failed to load services');
                setDebugInfo(`Error: ${err.message}`);
                
                
                console.log('Using fallback data...');
                setServices([
                    {
                        id: "1",
                        name: "Warm Swedish stress relief massage",
                        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1766569598956-6d690e.jpeg",
                        rating: 4.83,
                        reviews: "5K",
                        price: 1349,
                        originalPrice: null,
                        badge: "Hot bed"
                    },
                    {
                        id: "2",
                        name: "4 sessions (Mon-Sat only): Swedish massage",
                        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1763038402712-93a031.jpeg",
                        rating: 4.82,
                        reviews: "228K",
                        price: 1299,
                        originalPrice: null,
                        badge: null
                    },
                    {
                        id: "3",
                        name: "Warm deep tissue pain relief massage",
                        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1766569602230-c2b76a.jpeg",
                        rating: 4.84,
                        reviews: "5K",
                        price: 1499,
                        originalPrice: null,
                        badge: "Hot bed"
                    },
                    {
                        id: "4",
                        name: "4 sessions (Mon-Sat only): Deep tissue massage",
                        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1763038600373-5567e3.jpeg",
                        rating: 4.82,
                        reviews: "154K",
                        price: 1449,
                        originalPrice: null,
                        badge: null
                    },
                    {
                        id: "5",
                        name: "Leg pain relief massage for women",
                        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1764927910031-575580.jpeg",
                        rating: 4.85,
                        reviews: "12K",
                        price: 849,
                        originalPrice: null,
                        badge: null
                    }
                ]);
            }
        };

        loadWomenSpaServices();
    }, []);

    const cardsToShow = isMobile ? 2 : 5;
    const maxIndex = Math.max(0, services.length - cardsToShow);

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

    const handleCardClick = (service) => {
        const urlFriendlyName = service.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        
        navigate(`/service/${urlFriendlyName}/${service.id}`);
    };

    if (error) {
        console.warn('Using fallback data due to API error:', error);
    }

    return (
        <div className="w-full bg-white py-8 md:py-12">
            <div className="max-w-[1400px] mx-auto px-4">
                {/* Header */}
                <div className="mb-6 md:mb-8 px-1 md:px-2 flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">
                            Spa for Women
                        </h2>
                    </div>
                    <button 
                        onClick={() => navigate('/services?category=spa-women')}
                        className="text-purple-700 font-semibold text-sm md:text-base hover:text-purple-800 border border-gray-300 rounded-lg px-4 py-2 hover:bg-purple-50 transition-colors"
                    >
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
                            aria-label="Previous slide"
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
                                    onClick={() => handleCardClick(service)}
                                    className="cursor-pointer transition-all duration-300 group"
                                >
                                    {/* Image Container */}
                                    <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-gray-100">
                                        <div className="w-full aspect-[4/3]">
                                            <img
                                                src={service.image}
                                                alt={service.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        </div>
                                        {/* Hot bed badge */}
                                        {service.badge && (
                                            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                {service.badge}
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Container */}
                                    <div className="pt-2 md:pt-3">
                                        <h3 className="text-xs md:text-base font-semibold text-gray-900 line-clamp-2 mb-1 md:mb-2 group-hover:text-purple-600 transition-colors">
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
                                            <span className="text-sm md:text-base text-gray-700 font-semibold">
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