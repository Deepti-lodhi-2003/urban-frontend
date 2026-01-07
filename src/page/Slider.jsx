import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const BASE_URL = 'https://backend-urbancompany-1.onrender.com/api';
const SERVER_URL = 'https://backend-urbancompany-1.onrender.com';

const fetchCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/categories`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch categories');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://placehold.co/394x295/e2e8f0/64748b?text=No+Image';
  }
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  return imagePath.startsWith('/') 
    ? `${SERVER_URL}${imagePath}` 
    : `${SERVER_URL}/${imagePath}`;
};

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
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
      setError(null);
      const response = await fetchCategories();
      
      console.log('📦 API Response:', response); 
      
      if (response.success && response.data) {
      
        const activeCategories = response.data
          .filter(cat => cat.isActive)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        
        console.log(' Active Categories:', activeCategories); 
        console.log(' First Category Image:', activeCategories[0]?.image); 
        
        setCategories(activeCategories);
      }
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const handleSlideClick = (category) => {
    // Option 1: Using React Router navigate (if you're using React Router)
    // navigate(`/category/${category.slug}`);
    
    // Option 2: Using window.location (works without React Router)
    window.location.href = `/category/${category.slug}`;
    
    // Option 3: If you want to navigate to services page with category filter
    // window.location.href = `/services?category=${category._id}`;
  };

  const getVisibleSlides = () => {
    if (categories.length === 0) return [];
    
    const visible = [];
    const count = isMobile ? 1 : 3;
    
    for (let i = 0; i < count; i++) {
      visible.push(categories[(currentIndex + i) % categories.length]);
    }
    
    return visible;
  };

  // Loading State
  if (loading) {
    return (
      <div className="w-full bg-white lg:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8 px-1 md:px-2">
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">In the spotlight</h2>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full bg-white lg:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8 px-1 md:px-2">
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">In the spotlight</h2>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-800 font-medium">Error loading categories</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={loadCategories}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (categories.length === 0) {
    return (
      <div className="w-full bg-white lg:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8 px-1 md:px-2">
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">In the spotlight</h2>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">No categories available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white lg:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8 px-1 md:px-2">
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">In the spotlight</h2>
        </div>
        
        <div className="relative">
          {/* Left Arrow */}
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
          )}

          {/* Slides Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getVisibleSlides().map((category, idx) => (
              <div
                key={`${category._id}-${idx}`}
                onClick={() => handleSlideClick(category)}
                className="rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-2xl group"
              >
                <div className="relative">
                  <img
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    className="w-full h-auto aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    onLoad={() => console.log('✅ Image loaded:', category.name)}
                    onError={(e) => {
                      console.error('❌ Image failed:', category.name, category.image);
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/394x295/e2e8f0/64748b?text=No+Image';
                    }}
                  />
                  
                  {/* Category Name Overlay */}
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

          {/* Right Arrow */}
          {currentIndex < categories.length - (isMobile ? 1 : 3) && (
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </div>

        {/* Dots Indicator */}
        {categories.length > (isMobile ? 1 : 3) && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ 
              length: Math.ceil(categories.length - (isMobile ? 0 : 2)) 
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
  );
}