import React, { useState, useEffect } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Modal from './Model';
import LoginModal from './LoginModal';
import { addToCart, getCart, updateCartItem, removeFromCart, fetchServices } from '../page/Api';

export default function Details() {
    const { serviceName, serviceId } = useParams();
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [showAllOffers, setShowAllOffers] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loadingItems, setLoadingItems] = useState({});
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [currentService, setCurrentService] = useState(null);
    const [relatedServices, setRelatedServices] = useState([]);
    const [categoryServices, setCategoryServices] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPageServiceIds, setCurrentPageServiceIds] = useState([]);

    const allOffers = [
        {
            icon: "💰",
            title: "Up to ₹150 cashback",
            description: "Via Paytm UPI only",
            bgColor: "bg-green-100"
        },
        {
            icon: "💳",
            title: "Amazon cashback upto ₹125",
            description: "Via Amazon Pay balance",
            bgColor: "bg-green-100"
        },
        {
            icon: "📱",
            title: "Mobikwik cashback up to ₹250",
            description: "Via Mobikwik UPI Payment",
            bgColor: "bg-green-100"
        },
        {
            icon: "💵",
            title: "₹100 back - orders over ₹300",
            description: "Via Airtel Payments Bank",
            bgColor: "bg-green-100"
        },
        {
            icon: "💸",
            title: "Flat ₹100 Cashback",
            description: "Via Mobikwik UPI Payment",
            bgColor: "bg-green-100"
        },
        {
            icon: "🎁",
            title: "Up to ₹100 cashback",
            description: "Valid for BHIM app only",
            bgColor: "bg-green-100"
        }
    ];

    useEffect(() => {
        checkLoginStatus();
        loadCart();
        loadServices();

        const handleCartUpdate = () => {
            loadCart();
        };

        const handleLoginUpdate = () => {
            checkLoginStatus();
            loadCart();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('userLoggedIn', handleLoginUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('userLoggedIn', handleLoginUpdate);
        };
    }, [serviceId]);


    const checkLoginStatus = () => {
        const token = localStorage.getItem('authToken');
        const loggedIn = !!token;
        setIsLoggedIn(loggedIn);
        console.log('🔐 Login Status Check:', {
            isLoggedIn: loggedIn,
            hasToken: !!token,
            tokenLength: token ? token.length : 0
        });
        return loggedIn;
    };

    const loadServices = async () => {
        try {
            setLoadingServices(true);
            const response = await fetchServices({
                page: 1,
                limit: 100,
            });

            if (response.success && response.data.services) {
                const allServices = response.data.services;

                if (serviceId) {
                    const foundService = allServices.find(s => s._id === serviceId);
                    if (foundService) {
                        setCurrentService({
                            id: foundService._id,
                            name: foundService.name,
                            rating: foundService.rating || 4.80,
                            totalBookings: foundService.totalReviews || 312,
                            category: foundService.category?.name || 'Services',
                            categoryId: foundService.category?._id,
                            images: foundService.images || [],
                            description: foundService.description || '',
                            video: foundService.video || null
                        });

                        const sameCategoryServices = allServices.filter(s =>
                            s.category?._id === foundService.category?._id
                        );

                        const related = sameCategoryServices
                            .filter(s => s._id !== foundService._id)
                            .slice(0, 5)
                            .map(s => ({
                                label: s.name,
                                image: s.images && s.images.length > 0
                                    ? (s.images[0].startsWith('http')
                                        ? s.images[0]
                                        : `https://backend-urbancompany-1.onrender.com${s.images[0]}`)
                                    : 'https://via.placeholder.com/64',
                                id: s._id
                            }));

                        setRelatedServices(related);

                        const formattedCategoryServices = sameCategoryServices.map(service => ({
                            id: service._id,
                            name: service.name,
                            rating: service.rating || 4.5,
                            reviews: service.totalReviews ? `${(service.totalReviews / 1000).toFixed(1)}K` : '0',
                            price: service.price,
                            discountPrice: service.discountPrice,
                            description: service.description,
                            image: service.images && service.images.length > 0
                                ? (service.images[0].startsWith('http')
                                    ? service.images[0]
                                    : `https://backend-urbancompany-1.onrender.com${service.images[0]}`)
                                : 'https://via.placeholder.com/150',
                            duration: service.duration
                        }));

                        setCategoryServices(formattedCategoryServices);

                        // ✅ Store current page service IDs
                        const pageServiceIds = formattedCategoryServices.map(s => s.id);
                        setCurrentPageServiceIds(pageServiceIds);
                        console.log('📦 Current page service IDs:', pageServiceIds);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading services:', error);
        } finally {
            setLoadingServices(false);
        }
    };

    const handleServiceClick = (serviceId) => {
        const service = [...relatedServices].find(s => s.id === serviceId);
        if (service) {
            const urlName = service.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            navigate(`/service/${urlName}/${serviceId}`);
            window.location.reload();
        }
    };

    const loadCart = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.log('📦 No token found, cart set to null');
                setCart(null);
                return;
            }

            const response = await getCart();
            if (response.success) {
                console.log('📦 Full cart loaded:', response.data);
                setCart(response.data);
                window.dispatchEvent(new CustomEvent('cartUpdated'));
            }
        } catch (error) {
            console.error('❌ Error loading cart:', error);
        }
    };

    const showNotification = (message, type = 'success') => {
        const alertDiv = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        const icon = type === 'success' ? '✓' : '✗';

        alertDiv.className = `fixed top-20 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`;
        alertDiv.textContent = `${icon} ${message}`;
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    };

    const handleAddToCart = async (serviceId) => {
        const token = localStorage.getItem('authToken');

        console.log('🛒 Add to Cart clicked:', {
            serviceId,
            hasToken: !!token,
            isLoggedInState: isLoggedIn,
            tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
        });

        if (!token) {
            console.log('❌ No token found - showing login modal');
            setShowLoginModal(true);
            return;
        }

        console.log('✅ Token found - proceeding to add to cart');
        setLoading(true);

        try {
            const response = await addToCart(serviceId, 1);

            if (response.success) {
                console.log('✅ Item added to cart successfully');
                await loadCart();
                showNotification('Item added to cart successfully!', 'success');
            } else {
                throw new Error(response.message || 'Failed to add item to cart');
            }
        } catch (error) {
            console.error('❌ Error adding to cart:', error);
            showNotification(error.message || 'Failed to add item to cart', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (serviceId, newQuantity) => {
        if (newQuantity < 1) {
            try {
                await removeFromCart(serviceId);
                await loadCart();
                showNotification('Item removed from cart', 'success');
            } catch (error) {
                console.error('Error removing from cart:', error);
                showNotification('Failed to remove item', 'error');
            }
            return;
        }

        setLoading(true);
        try {
            const response = await updateCartItem(serviceId, newQuantity);
            if (response.success) {
                await loadCart();
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            showNotification('Failed to update quantity', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getItemQuantity = (serviceId) => {
        if (!cart || !cart.items) return 0;
        const item = cart.items.find(i => i.service._id === serviceId);
        return item ? item.quantity : 0;
    };

    // ✅ Filter cart items - only current page services
    const getCurrentPageCartItems = () => {
        if (!cart || !cart.items) return [];

        const filtered = cart.items.filter(item =>
            currentPageServiceIds.includes(item.service._id)
        );

        console.log('🎯 Filtered cart items for current page:', filtered);
        return filtered;
    };

    // ✅ Calculate totals for current page items only
    const getCurrentPageTotals = () => {
        const currentPageItems = getCurrentPageCartItems();

        if (currentPageItems.length === 0) {
            return {
                subtotal: 0,
                tax: 0,
                discount: 0,
                totalAmount: 0,
                itemCount: 0
            };
        }

        const subtotal = currentPageItems.reduce((sum, item) => {
            const price = item.discountPrice || item.price;
            return sum + (price * item.quantity);
        }, 0);

        const tax = subtotal * 0.18; // 18% tax
        const totalAmount = subtotal + tax;
        const itemCount = currentPageItems.reduce((sum, item) => sum + item.quantity, 0);

        return {
            subtotal: Math.round(subtotal),
            tax: Math.round(tax),
            discount: 0,
            totalAmount: Math.round(totalAmount),
            itemCount
        };
    };

    const getTotalItems = () => {
        return getCurrentPageTotals().itemCount;
    };

    const formatBookings = (num) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)} M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)} K`;
        }
        return num.toString();
    };

    const getVideoSource = () => {
        if (currentService?.video) {
            return currentService.video;
        }
        return "https://content.urbancompany.com/videos/supply/customer-app-supply/1749625423509-fd8c48/1749625423509-fd8c48.m3u8";
    };

    const handleLoginSuccess = () => {
        console.log('✅ Login successful - updating state');
        setIsLoggedIn(true);
        checkLoginStatus();
        loadCart();
        showNotification('Login successful!', 'success');
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
    };

    const currentPageItems = getCurrentPageCartItems();
    const pageTotals = getCurrentPageTotals();

    return (
        <>
            <Header />

            {showModal && (
                <Modal onClose={() => setShowModal(false)} />
            )}

            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}

            <style>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress {
                    animation: progress 5s ease-in-out infinite;
                }
            `}</style>

            <div className="min-h-screen">
                <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen px-4 md:px-7 gap-5 mt-10">
                    {/* Left Sidebar */}
                    <div className="w-full lg:w-92 bg-white p-4 md:p-6 lg:overflow-y-auto flex-shrink-0">
                        <div className="mb-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {currentService ? currentService.name : 'Service Details'}
                            </h1>
                            <div className="flex items-center gap-2 mt-2">
                                <svg width="8%" height="8%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M18.333 10a8.333 8.333 0 11-16.667 0 8.333 8.333 0 0116.667 0zm-7.894-4.694A.476.476 0 009.999 5a.476.476 0 00-.438.306L8.414 8.191l-2.977.25a.48.48 0 00-.414.342.513.513 0 00.143.532l2.268 2.033-.693 3.039a.51.51 0 00.183.518.458.458 0 00.528.022L10 13.298l2.548 1.629a.458.458 0 00.527-.022.51.51 0 00.184-.518l-.693-3.04 2.268-2.032a.513.513 0 00.143-.532.48.48 0 00-.415-.342l-2.976-.25-1.147-2.885z" fill="#572AC8"></path>
                                </svg>
                                <span className="text-sm font-medium">
                                    {currentService ? `${currentService.rating} (${formatBookings(currentService.totalBookings)} bookings)` : '4.80 (312 bookings)'}
                                </span>
                            </div>
                        </div>

                        <div className="mb-4 border border-gray-200 p-4 md:p-5 rounded-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-sm font-medium text-gray-600 whitespace-nowrap">
                                    Select a service
                                </h3>
                                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2">
                                {currentService && currentService.images.length > 0 && (
                                    <div className="flex flex-col items-center gap-2 p-2 md:p-3 rounded-lg bg-purple-50 border-2 border-purple-600">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={currentService.images[0].startsWith('http')
                                                    ? currentService.images[0]
                                                    : `https://backend-urbancompany-1.onrender.com${currentService.images[0]}`}
                                                alt={currentService.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="text-xs text-center text-purple-700 font-semibold">
                                            {currentService.name.length > 15 ? currentService.name.substring(0, 15) + '...' : currentService.name}
                                        </span>
                                    </div>
                                )}

                                {relatedServices.map((service, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col items-center gap-2 p-2 md:p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition hover:border-2 hover:border-purple-400"
                                        onClick={() => handleServiceClick(service.id)}
                                    >
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={service.image}
                                                alt={service.label}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="text-xs text-center text-gray-700">
                                            {service.label.length > 15 ? service.label.substring(0, 15) + '...' : service.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Center Content */}
                    <div className="flex-1 lg:overflow-y-auto">
                        <div className="relative overflow-hidden mb-6 md:mb-10 rounded-lg">
                            <video
                                playsInline
                                crossOrigin="anonymous"
                                poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0AQMAAADfKmdSAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRF9fX1sGmfigAAAB5JREFUeJztwTEBAAAAwqD1T20ND6AAAAAAAAAAfg0c1AABWiieBAAAAABJRU5ErkJggg=="
                                autoPlay
                                muted
                                loop
                                className="w-full lg:w-[63vw] rounded-lg"
                                style={{ aspectRatio: "16 / 9" }}
                            >
                                <source src={getVideoSource()} type="video/mp4" />
                            </video>

                            <div className="absolute bottom-5 left-0 w-full lg:w-[63vw] h-1 bg-gray-200 z-10">
                                <div className="h-full bg-white animate-progress"></div>
                            </div>
                        </div>

                        {/* Services List */}
                        <div className="flex flex-col lg:flex-row gap-6 px-0 md:px-8 pb-8 lg:border-t border-gray-200 lg:border-l">
                            <div className="flex-1 lg:pt-8 lg:border-r border-gray-200 lg:pr-8">
                                {loadingServices ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                                        <p className="mt-4 text-gray-600">Loading services...</p>
                                    </div>
                                ) : categoryServices.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-600">No services available.</p>
                                    </div>
                                ) : (
                                    <div className="mb-8">
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                                            {currentService?.category || 'Services'}
                                        </h2>
                                        {categoryServices.map((item, itemIdx) => {
                                            const quantity = getItemQuantity(item.id);
                                            return (
                                                <div key={itemIdx} className="bg-white p-4 md:p-6 mb-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start gap-4">
                                                    <div className="flex-1 w-full">
                                                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Star className="w-4 h-4 fill-purple-600 text-purple-600" />
                                                            <span className="text-sm font-medium">{item.rating}</span>
                                                            <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
                                                        </div>
                                                        {item.description && (
                                                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                                        )}
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="font-semibold text-gray-900">₹{item.discountPrice || item.price}</span>
                                                            {item.discountPrice && item.discountPrice !== item.price && (
                                                                <span className="text-gray-500 line-through">₹{item.price}</span>
                                                            )}
                                                        </div>
                                                        {item.duration && (
                                                            <p className="text-xs text-gray-500 mt-2">{item.duration} mins</p>
                                                        )}
                                                    </div>
                                                    <div className="flex sm:flex-col flex-row-reverse sm:items-end items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:ml-6">
                                                        {item.image && (
                                                            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.src = 'https://via.placeholder.com/150';
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        {quantity > 0 ? (
                                                            <div className="flex items-center border-2 border-purple-600 rounded-lg">
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(item.id, quantity - 1)}
                                                                    disabled={loading}
                                                                    className="px-3 py-2 text-purple-600 hover:bg-purple-50 disabled:opacity-50"
                                                                >
                                                                    −
                                                                </button>
                                                                <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(item.id, quantity + 1)}
                                                                    disabled={loading}
                                                                    className="px-3 py-2 text-purple-600 hover:bg-purple-50 disabled:opacity-50"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleAddToCart(item.id)}
                                                                disabled={loading}
                                                                className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition whitespace-nowrap disabled:opacity-50"
                                                            >
                                                                {loading ? 'Adding...' : 'Add'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* ✅ Right Sidebar - Cart (ONLY CURRENT PAGE ITEMS) */}
                            <div className="w-full lg:w-80 lg:pt-8 flex-shrink-0 lg:sticky lg:top-0 lg:h-fit">
                                <div className="w-full space-y-6">
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cart</h3>

                                        {currentPageItems.length === 0 ? (
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 mx-auto mb-3 text-gray-300">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 text-sm">No items in your cart</p>
                                            </div>
                                        ) : (
                                            <>
                                                {currentPageItems.map((item, idx) => (
                                                    <div key={idx} className="rounded-lg p-4 mb-4 border border-gray-100">
                                                        <div className="flex items-start justify-between gap-3 mb-3">
                                                            <h4 className="text-sm font-medium text-gray-900 flex-1">{item.service.name}</h4>
                                                            <div className="flex items-center border border-gray-300 rounded-md">
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(item.service._id, item.quantity - 1)}
                                                                    className="px-2 py-1 text-purple-600 hover:bg-gray-100"
                                                                >
                                                                    −
                                                                </button>
                                                                <span className="px-3 py-1 text-sm">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(item.service._id, item.quantity + 1)}
                                                                    className="px-2 py-1 text-purple-600 hover:bg-gray-100"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-semibold text-gray-900">₹{(item.discountPrice || item.price) * item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}

                                                <NavLink to="/cart">
                                                    <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                                                        <div className="flex items-center justify-between px-4">
                                                            <span>₹{pageTotals.totalAmount}</span>
                                                            <span>View Cart ({pageTotals.itemCount})</span>
                                                        </div>
                                                    </button>
                                                </NavLink>
                                            </>
                                        )}
                                    </div>

                                    {/* Offers */}
                                    <div className="rounded-lg border border-gray-200 p-4 bg-white">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#05945B">
                                                    <path d="M7.75 8.5a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM14.75 15.5a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path>
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm6.5-5.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm7 7a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-8.93 3.12l9.9-9.9 1.06 1.06-9.9 9.9-1.06-1.06z"></path>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1">{allOffers[0].title}</h3>
                                                <p className="text-sm text-gray-600">{allOffers[0].description}</p>
                                            </div>
                                        </div>

                                        {showAllOffers && (
                                            <div className="space-y-3 mb-3 mt-4">
                                                {allOffers.slice(1).map((offer, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                                                            {offer.icon}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900 text-sm mb-1">{offer.title}</h4>
                                                            <p className="text-xs text-gray-600">{offer.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setShowAllOffers(!showAllOffers)}
                                            className="text-purple-600 text-sm font-semibold hover:text-purple-700 flex items-center gap-1"
                                        >
                                            {showAllOffers ? 'View Less' : 'View More Offers'}
                                            {showAllOffers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {/* UC Promise */}
                                    <div className="rounded-lg border border-gray-200 px-6 py-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-semibold text-gray-900">UC Promise</h3>
                                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1702985608819-4a9ba6.jpeg"
                                                    alt="UC Promise"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.75 15.836l9.793-9.793 1.414 1.415-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25 1.414-1.415 4.543 4.543z" fill="#0F0F0F"></path>
                                                    </svg>
                                                </div>
                                                <span className="text-sm text-gray-700">Verified Professionals</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.75 15.836l9.793-9.793 1.414 1.415-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25 1.414-1.415 4.543 4.543z" fill="#0F0F0F"></path>
                                                    </svg>
                                                </div>
                                                <span className="text-sm text-gray-700">Hassle Free Booking</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.75 15.836l9.793-9.793 1.414 1.415-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25 1.414-1.415 4.543 4.543z" fill="#0F0F0F"></path>
                                                    </svg>
                                                </div>
                                                <span className="text-sm text-gray-700">Transparent Pricing</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}