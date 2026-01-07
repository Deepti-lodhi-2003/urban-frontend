import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ServiceCategoryModal({ isOpen, onClose, category, subcategories, onSubcategoryClick }) {
  const navigate = useNavigate();

  if (!isOpen || !category) return null;

  // Handle subcategory click and navigate to details page
  const handleSubcategoryClick = (subcategory) => {
    navigate('/details', { 
      state: { 
        category: category,
        subcategory: subcategory 
      } 
    });
    onClose(); // Close modal after navigation
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-8 relative max-h-[90vh] overflow-y-auto animate-slideUp shadow-2xl">
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

        {/* Subcategories Grid */}
        {subcategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => handleSubcategoryClick(subcategory)}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                {/* Icon Container */}
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">{subcategory.icon}</span>
                </div>
                
                {/* Subcategory Name */}
                <span className="text-sm font-medium text-center text-gray-700 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {subcategory.name}
                </span>

                {/* Price (if available) */}
                {subcategory.price && (
                  <span className="text-xs font-semibold text-purple-600">
                    ₹{subcategory.price}
                  </span>
                )}

                {/* Arrow Icon */}
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="text-gray-500 text-lg">No services available</p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Click on any service to view details and book
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