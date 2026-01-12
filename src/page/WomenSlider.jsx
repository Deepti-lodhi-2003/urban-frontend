import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchServices, getImageUrl } from './Api';

export default function WomenSlider() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [womenSalonCategory, setWomenSalonCategory] = useState(null);

    // ✅ Target Category - Women's Salon & Spa
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
                
                console.log('🔍 Fetching Women Salon & Spa services...');
                
                // Fetch all services
                const response = await fetchServices({
                    page: 1,
                    limit: 100, // Fetch more to filter
                });

                if (response.success && response.data?.services) {
                    console.log('✅ Total Services fetched:', response.data.services.length);
                    
                    // ✅ Filter only Women's Salon & Spa category services
                    const womenSalonServices = response.data.services.filter(service => {
                        const categoryName = service.category?.name;
                        const categorySlug = service.category?.slug;
                        
                        return categoryName === TARGET_CATEGORY_NAME || 
                               categorySlug === TARGET_CATEGORY_SLUG;
                    });

                    console.log('💅 Women Salon & Spa Services:', womenSalonServices.length);

                    const fetchedServices = womenSalonServices.map(service => ({
                        id: service._id,
                        name: service.name,
                        categoryId: service.category?._id,
                        categoryName: service.category?.name,
                        categorySlug: service.category?.slug,
                        image: service.images && service.images.length > 0 
                            ? getImageUrl(service.images[0]) 
                            : 'https://via.placeholder.com/233x160?text=No+Image',
                        rating: service.rating || 4.8,
                        reviews: service.totalReviews ? `${(service.totalReviews / 1000).toFixed(0)}K` : '0',
                        price: service.discountPrice || service.price,
                        originalPrice: service.discountPrice ? service.price : null,
                        discount: service.discountPrice && service.price 
                            ? `${Math.round(((service.price - service.discountPrice) / service.price) * 100)}% OFF`
                            : null
                    }));

                    // Store category info from first service
                    if (fetchedServices.length > 0 && fetchedServices[0].categoryId) {
                        setWomenSalonCategory({
                            _id: fetchedServices[0].categoryId,
                            name: fetchedServices[0].categoryName,
                            slug: fetchedServices[0].categorySlug
                        });
                        console.log('📁 Category Info:', {
                            id: fetchedServices[0].categoryId,
                            name: fetchedServices[0].categoryName
                        });
                    }

                    setServices(fetchedServices);
                } else {
                    console.log('⚠️ No services found');
                    setServices([]);
                }
            } catch (err) {
                console.error('❌ Error loading women salon services:', err);
                setError('Failed to load services');
            } finally {
                setLoading(false);
            }
        };

        loadWomenSalonServices();
    }, []);

    const cardsToShow = isMobile ? 2 : 4;
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

    const handleSeeAll = () => {
        if (womenSalonCategory) {
            // Navigate to category page with category ID
            const urlFriendlyName = womenSalonCategory.slug || womenSalonCategory.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            
            navigate(`/category/${urlFriendlyName}/${womenSalonCategory._id}`);
        } else {
            // Fallback to services page
            navigate('/services');
        }
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {[1, 2, 3, 4].map((i) => (
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
                            <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-2">
                                Women's Salon & Spa
                            </h2>
                            <p className="text-sm md:text-base text-gray-600">
                                Pamper yourself at home
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
                        <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-2">
                            {womenSalonCategory?.name || "Women's Salon & Spa"}
                        </h2>
                        <p className="text-sm md:text-base text-gray-600">
                            Pamper yourself at home
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            {getVisibleCards().map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => handleCardClick(service)}
                                    className="cursor-pointer transition-all duration-300 group"
                                >
                                    <div className="relative overflow-hidden rounded-t-lg">
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/233x160?text=Service';
                                            }}
                                        />
                                        {service.discount && (
                                            <div className="absolute top-0 left-2 md:left-3 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-1 md:py-1.4 z-10"
                                                style={{
                                                    backgroundColor: "rgba(7, 121, 76, 1.00)",
                                                    borderBottomLeftRadius: "4px",
                                                    borderBottomRightRadius: "4px"
                                                }}>
                                                {service.discount}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-2 md:pt-3">
                                        <h3 className="text-xs md:text-base font-semibold text-gray-900 line-clamp-2 mb-1 md:mb-2 group-hover:text-purple-600 transition-colors">
                                            {service.name}
                                        </h3>

                                        <div className="flex items-center gap-1 mb-1 md:mb-2">
                                            <Star className="w-2 h-2 md:w-3 md:h-3 fill-gray-600 text-gray-600" />
                                            <span className="text-xs md:text-sm text-gray-600">
                                                {service.rating}
                                            </span>
                                            <span className="text-xs text-gray-700">
                                                ({service.reviews})
                                            </span>
                                        </div>

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