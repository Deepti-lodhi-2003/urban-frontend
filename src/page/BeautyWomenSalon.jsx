import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function BeautyWomenSalon() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [womenSalonCategory, setWomenSalonCategory] = useState(null);

    const TARGET_CATEGORY_NAME = "Women's Salon & Spa";
    const TARGET_CATEGORY_SLUG = "womens-salon-spa";

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const loadWomenSalonServices = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch('https://backend-urbancompany-1.onrender.com/api/services?limit=100');
                const data = await response.json();

                if (data.success && data.data?.services) {
                    const womenSalonServices = data.data.services.filter(service => {
                        const categoryName = service.category?.name;
                        const categorySlug = service.category?.slug;
                        
                        return categoryName === TARGET_CATEGORY_NAME || 
                               categorySlug === TARGET_CATEGORY_SLUG;
                    });

                    const fetchedServices = womenSalonServices.map(service => ({
                        id: service._id,
                        name: service.name,
                        categoryId: service.category?._id,
                        categoryName: service.category?.name,
                        categorySlug: service.category?.slug,
                        image: service.images && service.images.length > 0 
                            ? getImageUrl(service.images[0]) 
                            : 'https://via.placeholder.com/233x160?text=No+Image'
                    }));

                    if (fetchedServices.length > 0 && fetchedServices[0].categoryId) {
                        setWomenSalonCategory({
                            _id: fetchedServices[0].categoryId,
                            name: fetchedServices[0].categoryName,
                            slug: fetchedServices[0].categorySlug
                        });
                    }

                    setServices(fetchedServices);
                } else {
                    setServices([]);
                }
            } catch (err) {
                console.error('Error loading women salon services:', err);
                setError('Failed to load services');
            } finally {
                setLoading(false);
            }
        };

        loadWomenSalonServices();
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) {
            return 'https://via.placeholder.com/233x160?text=No+Image';
        }
        
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        
        const SERVER_URL = 'https://backend-urbancompany-1.onrender.com';
        return imagePath.startsWith('/') 
            ? `${SERVER_URL}${imagePath}` 
            : `${SERVER_URL}/${imagePath}`;
    };

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
        
        window.location.href = `/service/${urlFriendlyName}/${service.id}`;
    };

    if (loading) {
        return (
            <div className="w-full bg-white py-8 md:py-12">
                <div className="max-w-[1400px] mx-auto px-4">
                    <div className="mb-6 md:mb-8 px-1 md:px-2">
                        <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-2">
                            Women's Salon & Spa
                        </h2>
                        <p className="text-sm md:text-base text-gray-600">
                            Pamper yourself at home
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 rounded-lg h-16 mb-2"></div>
                                <div className="bg-gray-200 rounded-lg aspect-[4/3]"></div>
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
                    <div className="mb-6 md:mb-8 px-1 md:px-2">
                        <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-2">
                            Women's Salon & Spa
                        </h2>
                        <p className="text-sm md:text-base text-gray-600">
                            Pamper yourself at home
                        </p>
                    </div>
                    <p className="text-center text-gray-500 py-8">No services available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white py-8 md:py-12">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="mb-6 md:mb-8 px-1 md:px-2">
                    <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-2">
                        {womenSalonCategory?.name || "Women's Salon & Spa"}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600">
                        Pamper yourself at home
                    </p>
                </div>

                <div className="relative">
                    <div className="px-0 md:px-8 relative z-10">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                            {getVisibleCards().map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => handleCardClick(service)}
                                    className="cursor-pointer transition-all duration-300 group"
                                >
                                    <div className="rounded-lg md:rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-all duration-300">
                                        {/* Title at top - Fixed height */}
                                        <div className="p-3 md:p-4 bg-white h-16 md:h-20 flex items-center justify-center">
                                            <h3 className="text-sm md:text-base font-normal text-gray-900 group-hover:text-purple-600 transition-colors duration-200 text-center line-clamp-2">
                                                {service.name}
                                            </h3>
                                        </div>
                                        
                                        {/* Image - Fixed height */}
                                        <div className="relative overflow-hidden">
                                            <div className="w-full h-40 md:h-48">
                                                <img
                                                    src={service.image}
                                                    alt={service.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/233x160?text=Service';
                                                    }}
                                                />
                                            </div>
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