// ================== CardPage.jsx - Updated Complete Code ==================

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { getCart, updateCartItem, removeFromCart } from '../page/Api';

export default function CardPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
    
    
    const handleBookingSuccess = () => {
      console.log('Booking successful! Reloading cart...');
      loadCart(); 
    };
    
    window.addEventListener('bookingSuccess', handleBookingSuccess);
    
    return () => {
      window.removeEventListener('bookingSuccess', handleBookingSuccess);
    };
  }, []);

  const loadCart = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await getCart();
      if (response.success) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (serviceId, newQuantity) => {
    if (newQuantity < 1) {
      if (window.confirm('Remove this item from cart?')) {
        try {
          await removeFromCart(serviceId);
          await loadCart();
        } catch (error) {
          console.error('Error removing item:', error);
        }
      }
      return;
    }

    try {
      await updateCartItem(serviceId, newQuantity);
      await loadCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleCheckoutSingleItem = (item) => {
    const checkoutItem = {
      service: item.service,
      quantity: item.quantity,
      price: item.price,
      discountPrice: item.discountPrice,
      totalPrice: (item.discountPrice || item.price) * item.quantity,
      
      serviceId: item.service._id
    };
    
    sessionStorage.setItem('checkoutItem', JSON.stringify(checkoutItem));
    navigate('/checkout');
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/150';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `https://backend-urbancompany-1.onrender.com${imageUrl}`;
  };

  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 relative">
        <ShoppingCart className="w-32 h-32 text-gray-300" strokeWidth={1} />
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-1 bg-gray-400 mb-1"></div>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 rounded-full border-2 border-gray-400"></div>
            <div className="w-2 h-2 rounded-full border-2 border-gray-400"></div>
            <div className="w-2 h-2 rounded-full border-2 border-gray-400"></div>
            <div className="w-2 h-2 rounded-full border-2 border-gray-400"></div>
          </div>
        </div>
        <div className="absolute -top-2 right-8">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M10 15 L15 10 L20 15 L25 5 L30 10 L35 8" stroke="#7C3AED" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Your cart is empty
      </h2>
      
      <p className="text-gray-600 mb-8">
        Let's add some services
      </p>

      <NavLink to="/">
        <button className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
          Explore services
        </button>
      </NavLink>
    </div>
  );

  const CartWithItems = () => (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-8 h-8 text-purple-600" />
        <h1 className="text-3xl font-bold">Your cart</h1>
      </div>

      {cart.items.map((item) => (
        <div key={item._id} className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              {item.service.images && item.service.images.length > 0 ? (
                <img 
                  src={getImageUrl(item.service.images[0])}
                  alt={item.service.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
              ) : (
                <span className="text-3xl"></span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{item.service.name}</h3>
              <p className="text-gray-600">
                {item.quantity} service • ₹{(item.discountPrice || item.price) * item.quantity}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-700">• {item.service.description || 'Service details'}</p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-600">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button 
                onClick={() => handleUpdateQuantity(item.service._id, item.quantity - 1)}
                className="px-3 py-2 text-purple-600 hover:bg-gray-100"
              >
                −
              </button>
              <span className="px-4 py-2 text-sm font-medium">{item.quantity}</span>
              <button 
                onClick={() => handleUpdateQuantity(item.service._id, item.quantity + 1)}
                className="px-3 py-2 text-purple-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <NavLink to="/" className="flex-1">
              <button className="w-full px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-white transition-colors">
                Add More
              </button>
            </NavLink>
            <button 
              onClick={() => handleCheckoutSingleItem(item)}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <NavLink to="/">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </NavLink>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
   <>
   <Header/>
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <NavLink to="/">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </NavLink>
        </div>

        {!cart || !cart.items || cart.items.length === 0 ? <EmptyCart /> : <CartWithItems />}
      </div>
    </div>

    <Footer/>
   </>
  );
}





const handleBookingSuccess = async (bookingId) => {
  try {
    const checkoutItem = JSON.parse(sessionStorage.getItem('checkoutItem') || '{}');
    
    if (checkoutItem.serviceId) {
      await removeFromCart(checkoutItem.serviceId);
      console.log(' Item removed from cart');
      
   
      window.dispatchEvent(new Event('bookingSuccess'));
      
     
      sessionStorage.removeItem('checkoutItem');
    }
    
   
    navigate(`/booking/${bookingId}`);
  } catch (error) {
    console.error('Error clearing cart:', error);
    navigate(`/booking/${bookingId}`);
  }
};