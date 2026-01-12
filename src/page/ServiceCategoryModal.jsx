import React from 'react';
import { X, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl, formatPrice } from './Api';

export default function ServiceCategoryModal({ 
  isOpen, 
  onClose, 
  category, 
  subcategories = [], 
  onSubcategoryClick,
  loading = false 
}) {
  const navigate = useNavigate();

  if (!isOpen || !category) return null;

  // Handle service click and navigate to details page
  const handleServiceClick = (service) => {
    // Convert service name to URL-friendly format
    const urlFriendlyName = service.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Navigate to service details page with service ID and name in URL
    navigate(`/service/${urlFriendlyName}/${service.id}`);
    onClose(); // Close modal after navigation
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-8 relative max-h-[90vh] overflow-y-auto animate-slideUp shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8 pr-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {category.name}
          </h2>
          {category.description && (
            <p className="text-gray-600">{category.description}</p>
          )}
        </div>

        {/* Content */}
        {loading ? (
          // Loading State
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col gap-3 p-5 rounded-2xl border-2 border-gray-100 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : subcategories.length > 0 ? (
          // Services Grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subcategories.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                {/* Image/Icon Container */}
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                  {service.image ? (
                    <img 
                      src={getImageUrl(service.image)} 
                      alt={service.name}
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span 
                    className="text-3xl"
                    style={{ display: service.image ? 'none' : 'flex' }}
                  >
                    {service.icon || '🛠️'}
                  </span>
                </div>
                
                {/* Service Name */}
                <span className="text-sm font-medium text-center text-gray-700 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {service.name}
                </span>

                {/* Price & Rating */}
                <div className="flex flex-col items-center gap-1">
                  {service.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-purple-600">
                        {formatPrice(service.price)}
                      </span>
                      {service.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(service.originalPrice)}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {service.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{service.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Arrow Icon */}
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="text-gray-500 text-lg">No services available</p>
            <p className="text-gray-400 text-sm mt-2">Services for this category will be added soon</p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            {subcategories.length > 0 
              ? `${subcategories.length} service${subcategories.length !== 1 ? 's' : ''} available • Click to view details and book`
              : 'More services coming soon'}
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}