import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { getCart, updateCartItem, removeFromCart } from '../page/Api';

export default function CardPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
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
                  src={item.service.images[0]} 
                  alt={item.service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">🚽</span>
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
                Add Services
              </button>
            </NavLink>
            <NavLink to="/checkout" className="flex-1">
              <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Checkout
              </button>
            </NavLink>
          </div>
        </div>
      ))}

      {/* Price Summary */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mt-6">
        <h3 className="text-lg font-bold mb-4">Price Details</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>₹{Math.round(cart.subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-gray-700">
            <span>Tax (18%)</span>
            <span>₹{Math.round(cart.tax)}</span>
          </div>
          
          {cart.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{Math.round(cart.discount)}</span>
            </div>
          )}
          
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between text-xl font-bold">
              <span>Total Amount</span>
              <span className="text-purple-600">₹{Math.round(cart.totalAmount)}</span>
            </div>
          </div>
        </div>

        {cart.discount > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              🎉 Congratulations! ₹{Math.round(cart.discount)} saved so far!
            </p>
          </div>
        )}
      </div>

      {/* Offers Section */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#05945B" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.75 8.5a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM14.75 15.5a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" fill="#05945B"></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm6.5-5.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm7 7a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-8.93 3.12l9.9-9.9 1.06 1.06-9.9 9.9-1.06-1.06z" fill="#05945B"></path>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Up to ₹150 cashback</h3>
            <p className="text-sm text-gray-600">Via Paytm UPI only</p>
          </div>
        </div>
      </div>
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
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <NavLink to="/">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </NavLink>
        </div>

        {/* Content */}
        {!cart || !cart.items || cart.items.length === 0 ? <EmptyCart /> : <CartWithItems />}
      </div>
    </div>

    <Footer/>
   </>
  );
}