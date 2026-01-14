import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchServices, getImageUrl } from './Api';

export default function CleaningEsential() {
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
        const loadServices = async () => {
            try {
                setLoading(true);
                const response = await fetchServices({
                    page: 1,
                    limit: 20,
                    search: 'cleaning'
                });
                
                if (response.success && response.data?.services) {
                    setServices(response.data.services);
                }
            } catch (err) {
                console.error('Error loading services:', err);
                setError('Failed to load services');
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, []);

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

    const handleCardClick = (service) => {
        const urlFriendlyName = service.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        
        navigate(`/service/${urlFriendlyName}/${service._id}`);
    };

    const handleSeeAll = () => {
        if (services.length > 0) {
            const firstService = services[0];
            const urlFriendlyName = firstService.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            
            navigate(`/service/${urlFriendlyName}/${firstService._id}`);
        }
    };

    if (loading) {
        return (
            <div className="w-full bg-white py-8 md:py-12">
                <div className="max-w-[1400px] mx-auto px-4">
                    <div className="mb-6 md:mb-8 px-1 md:px-2 flex items-start justify-between">
                        <div>
                            <div className="mb-2 md:mb-3 px-1 md:px-2">
                                <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">
                                    Cleaning Essentials
                                </h2>
                            </div>
                            <p className="text-sm md:text-base text-gray-600">
                                Monthly cleaning essential services
                            </p>
                        </div>
                        <button className="text-purple-700 font-semibold text-sm md:text-base hover:text-purple-800 border border-gray-300 rounded-lg px-4 py-2 hover:bg-purple-50 transition-colors">
                            See all
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 rounded-xl aspect-[4/3] mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !services.length) {
        return (
            <div className="w-full bg-white py-8 md:py-12">
                <div className="max-w-[1400px] mx-auto px-4">
                    <div className="mb-6 md:mb-8 px-1 md:px-2 flex items-start justify-between">
                        <div>
                            <div className="mb-2 md:mb-3 px-1 md:px-2">
                                <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">
                                    Cleaning Essentials
                                </h2>
                            </div>
                            <p className="text-sm md:text-base text-gray-600">
                                Monthly cleaning essential services
                            </p>
                        </div>
                        <button 
                            onClick={handleSeeAll}
                            className="text-purple-700 font-semibold text-sm md:text-base hover:text-purple-800 border border-gray-300 rounded-lg px-4 py-2 hover:bg-purple-50 transition-colors"
                        >
                            See all
                        </button>
                    </div>
                    <p className="text-center text-gray-500 py-8">No services available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white py-8 md:py-12">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="mb-6 md:mb-8 px-1 md:px-2 flex items-start justify-between">
                    <div>
                        <div className="mb-2 md:mb-3 px-1 md:px-2">
                            <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">
                                Cleaning Essentials
                            </h2>
                        </div>
                        <p className="text-sm md:text-base text-gray-600">
                            Monthly cleaning essential services
                        </p>
                    </div>
                    <button 
                        onClick={handleSeeAll}
                        className="text-purple-700 font-semibold text-sm md:text-base hover:text-purple-800 border border-gray-300 rounded-lg px-4 py-2 hover:bg-purple-50 transition-colors"
                    >
                        See all
                    </button>
                </div>

                
                <div className="relative">
                    <div className="px-0 md:px-8 relative z-10">
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
                                                src={service.images && service.images.length > 0 
                                                    ? getImageUrl(service.images[0]) 
                                                    : 'https://via.placeholder.com/300x225?text=Service'}
                                                alt={service.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/300x225?text=Service';
                                                }}
                                            />
                                        </div>
                                    </div>

                                    
                                    <div className="pt-2 md:pt-3">
                                        <h3 className="text-xs md:text-base font-semibold text-gray-900 line-clamp-2 mb-1 md:mb-2 group-hover:text-purple-600 transition-colors duration-200">
                                            {service.name}
                                        </h3>

                                        
                                        <div className="flex items-center gap-1 mb-1 md:mb-2">
                                            <Star className="w-2 h-2 md:w-3 md:h-3 fill-gray-600 text-gray-600" />
                                            <span className="text-xs md:text-sm text-gray-600">
                                                {service.rating ? service.rating.toFixed(2) : '4.5'}
                                            </span>
                                            <span className="text-xs text-gray-700">
                                                ({service.totalReviews || 0})
                                            </span>
                                        </div>

                                        
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm md:text-base text-gray-700">
                                                ₹{service.discountPrice || service.price}
                                            </span>
                                            {service.discountPrice && service.price !== service.discountPrice && (
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

                    
                    {currentIndex > 0 && (
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 md:-left-2 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-2 z-20 bg-white rounded-full p-2 md:p-3 shadow-lg md:shadow-2xl hover:shadow-xl transition-all border border-gray-300 hover:border-gray-400"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
                        </button>
                    )}

                    
                    {currentIndex < maxIndex && (
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 md:right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-2 z-20 bg-white rounded-full p-2 md:p-3 shadow-lg md:shadow-2xl hover:shadow-xl transition-all border border-gray-300 hover:border-gray-400"
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