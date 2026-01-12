import React, { useState, useEffect } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Modal from './Model';
import LoginModal from './LoginModal';
import { addToCart, getCart, updateCartItem, removeFromCart, fetchServices, fetchCategoryById, getImageUrl } from '../page/Api';

export default function CategoryPage() {
    const { categoryName, categoryId } = useParams();
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [showAllOffers, setShowAllOffers] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loadingItems, setLoadingItems] = useState({});
    const [loadingServices, setLoadingServices] = useState(true);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [categoryServices, setCategoryServices] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPageServiceIds, setCurrentPageServiceIds] = useState([]);

    const allOffers = [
        { icon: "💰", title: "Up to ₹150 cashback", description: "Via Paytm UPI only", bgColor: "bg-green-100" },
        { icon: "💳", title: "Amazon cashback upto ₹125", description: "Via Amazon Pay balance", bgColor: "bg-green-100" },
        { icon: "📱", title: "Mobikwik cashback up to ₹250", description: "Via Mobikwik UPI Payment", bgColor: "bg-green-100" },
        { icon: "💵", title: "₹100 back - orders over ₹300", description: "Via Airtel Payments Bank", bgColor: "bg-green-100" },
        { icon: "💸", title: "Flat ₹100 Cashback", description: "Via Mobikwik UPI Payment", bgColor: "bg-green-100" },
        { icon: "🎁", title: "Up to ₹100 cashback", description: "Valid for BHIM app only", bgColor: "bg-green-100" }
    ];

    useEffect(() => {
        checkLoginStatus();
        loadCart();
        loadCategoryData();

        const handleCartUpdate = () => loadCart();
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
    }, [categoryId]);

    const checkLoginStatus = () => {
        const token = localStorage.getItem('authToken');
        const loggedIn = !!token;
        setIsLoggedIn(loggedIn);
        console.log('🔐 Login Status:', { isLoggedIn: loggedIn, hasToken: !!token });
        return loggedIn;
    };

    const loadCategoryData = async () => {
        try {
            setLoadingServices(true);
            console.log('📁 Loading category:', categoryId);

            const categoryResponse = await fetchCategoryById(categoryId);
            
            if (categoryResponse.success && categoryResponse.data) {
                const category = categoryResponse.data;
                console.log('✅ Category loaded:', category.name);
                
                const processedCategory = {
                    id: category._id,
                    name: category.name,
                    description: category.description,
                    image: category.image ? getImageUrl(category.image) : null,
                    video: category.video ? getImageUrl(category.video) : null,
                    slug: category.slug
                };

                console.log('🎥 Category video:', processedCategory.video ? 'Available' : 'Not available');
                setCurrentCategory(processedCategory);

                const servicesResponse = await fetchServices({
                    page: 1,
                    limit: 100,
                    category: categoryId
                });

                if (servicesResponse.success && servicesResponse.data.services) {
                    const services = servicesResponse.data.services;
                    console.log('🎯 Services found:', services.length);

                    const formattedServices = services.map(service => ({
                        id: service._id,
                        name: service.name,
                        rating: service.rating || 4.5,
                        reviews: service.totalReviews ? `${(service.totalReviews / 1000).toFixed(1)}K` : '0',
                        price: service.price,
                        discountPrice: service.discountPrice,
                        description: service.description,
                        image: service.images && service.images.length > 0 ? getImageUrl(service.images[0]) : 'https://via.placeholder.com/150',
                        duration: service.duration,
                        video: service.video ? getImageUrl(service.video) : null,
                        slug: service.slug
                    }));

                    setCategoryServices(formattedServices);
                    setCurrentPageServiceIds(formattedServices.map(s => s.id));
                    console.log('✅ Services loaded successfully');
                }
            }
        } catch (error) {
            console.error('❌ Error loading category:', error);
        } finally {
            setLoadingServices(false);
        }
    };

    const loadCart = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setCart(null);
                return;
            }

            const response = await getCart();
            if (response.success) {
                setCart(response.data);
                window.dispatchEvent(new CustomEvent('cartUpdated'));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    const showNotification = (message, type = 'success') => {
        const alertDiv = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        alertDiv.className = `fixed top-20 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`;
        alertDiv.textContent = `${type === 'success' ? '✓' : '✗'} ${message}`;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 3000);
    };

    const handleAddToCart = async (serviceId) => {
        if (!localStorage.getItem('authToken')) {
            setShowLoginModal(true);
            return;
        }

        setLoadingItems(prev => ({ ...prev, [serviceId]: true }));
        try {
            const response = await addToCart(serviceId, 1);
            if (response.success) {
                await loadCart();
                showNotification('Item added to cart!');
            }
        } catch (error) {
            showNotification('Failed to add item', 'error');
        } finally {
            setLoadingItems(prev => ({ ...prev, [serviceId]: false }));
        }
    };

    const handleUpdateQuantity = async (serviceId, newQuantity) => {
        if (newQuantity < 1) {
            try {
                await removeFromCart(serviceId);
                await loadCart();
                showNotification('Item removed from cart');
            } catch (error) {
                showNotification('Failed to remove item', 'error');
            }
            return;
        }

        setLoadingItems(prev => ({ ...prev, [serviceId]: true }));
        try {
            await updateCartItem(serviceId, newQuantity);
            await loadCart();
        } catch (error) {
            showNotification('Failed to update quantity', 'error');
        } finally {
            setLoadingItems(prev => ({ ...prev, [serviceId]: false }));
        }
    };

    const handleServiceClick = (service) => {
        const urlFriendlyName = service.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        navigate(`/service/${urlFriendlyName}/${service.id}`);
    };

    const getItemQuantity = (serviceId) => {
        if (!cart || !cart.items) return 0;
        const item = cart.items.find(i => i.service._id === serviceId);
        return item ? item.quantity : 0;
    };

    const getCurrentPageCartItems = () => {
        if (!cart || !cart.items) return [];
        return cart.items.filter(item => currentPageServiceIds.includes(item.service._id));
    };

    const getCurrentPageTotals = () => {
        const currentPageItems = getCurrentPageCartItems();
        if (currentPageItems.length === 0) return { subtotal: 0, itemCount: 0 };

        const subtotal = currentPageItems.reduce((sum, item) => {
            const price = item.discountPrice || item.price;
            return sum + (price * item.quantity);
        }, 0);

        const itemCount = currentPageItems.reduce((sum, item) => sum + item.quantity, 0);
        return { subtotal: Math.round(subtotal), itemCount };
    };

    const getVideoSource = () => {
        if (currentCategory?.video) {
            console.log('✅ Using category video');
            return currentCategory.video;
        }

        const serviceWithVideo = categoryServices.find(s => s.video);
        if (serviceWithVideo?.video) {
            console.log('✅ Using service video');
            return serviceWithVideo.video;
        }

        console.log('⚠️ Using fallback video');
        return "https://content.urbancompany.com/videos/supply/customer-app-supply/1749625423509-fd8c48/1749625423509-fd8c48.m3u8";
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        checkLoginStatus();
        loadCart();
        showNotification('Login successful!');
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
    };

    const currentPageItems = getCurrentPageCartItems();
    const pageTotals = getCurrentPageTotals();

    return (
        <>
            <Header />

            {showModal && <Modal onClose={() => setShowModal(false)} />}
            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}

            <style>{`
                @keyframes slide-in {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in { animation: slide-in 0.3s ease-out; }
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress { animation: progress 5s ease-in-out infinite; }
            `}</style>

            <div className="min-h-screen">
                <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen px-4 md:px-7 gap-5 mt-10">
                    {/* Left Sidebar */}
                    <div className="w-full lg:w-92 bg-white p-4 md:p-6 lg:overflow-y-auto flex-shrink-0">
                        <div className="mb-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {currentCategory?.name || 'Category Services'}
                            </h1>
                            {currentCategory?.description && (
                                <p className="text-sm text-gray-600 mt-2">{currentCategory.description}</p>
                            )}
                        </div>

                        {currentCategory?.image && (
                            <div className="mb-6 rounded-lg overflow-hidden">
                                <img src={currentCategory.image} alt={currentCategory.name} className="w-full h-48 object-cover" 
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/400x200'} />
                            </div>
                        )}

                        <div className="mb-4 border border-gray-200 p-4 md:p-5 rounded-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-sm font-medium text-gray-600">Available Services</h3>
                                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
                            </div>
                            <div className="text-center py-4">
                                <p className="text-2xl font-bold text-purple-600">{categoryServices.length}</p>
                                <p className="text-sm text-gray-600">Services Available</p>
                            </div>
                        </div>
                    </div>

                    {/* Center Content */}
                    <div className="flex-1 lg:overflow-y-auto">
                        {/* Video */}
                        <div className="relative overflow-hidden mb-6 md:mb-10 rounded-lg">
                            <video
                                key={getVideoSource()}
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
                                        <p className="text-gray-600">No services available in this category.</p>
                                    </div>
                                ) : (
                                    <div className="mb-8">
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                                            {currentCategory?.name || 'Services'}
                                        </h2>
                                        {categoryServices.map((item) => {
                                            const quantity = getItemQuantity(item.id);
                                            return (
                                                <div key={item.id} className="bg-white p-4 md:p-6 mb-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start gap-4">
                                                    <div className="flex-1 w-full cursor-pointer" onClick={() => handleServiceClick(item)}>
                                                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                                                            {item.name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Star className="w-4 h-4 fill-purple-600 text-purple-600" />
                                                            <span className="text-sm font-medium">{item.rating}</span>
                                                            <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
                                                        </div>
                                                        {item.description && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>}
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="font-semibold text-gray-900">₹{item.discountPrice || item.price}</span>
                                                            {item.discountPrice && item.discountPrice !== item.price && (
                                                                <>
                                                                    <span className="text-gray-500 line-through">₹{item.price}</span>
                                                                    <span className="text-green-600 font-medium">
                                                                        {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                        {item.duration && <p className="text-xs text-gray-500 mt-2">⏱ {item.duration} mins</p>}
                                                    </div>
                                                    <div className="flex sm:flex-col flex-row-reverse sm:items-end items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:ml-6">
                                                        {item.image && (
                                                            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                                                                onClick={() => handleServiceClick(item)}>
                                                                <img src={item.image} alt={item.name}
                                                                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                                                            </div>
                                                        )}

                                                        {quantity > 0 ? (
                                                            <div className="flex items-center border-2 border-purple-600 rounded-lg">
                                                                <button onClick={() => handleUpdateQuantity(item.id, quantity - 1)}
                                                                    disabled={loadingItems[item.id]}
                                                                    className="px-3 py-2 text-purple-600 hover:bg-purple-50 disabled:opacity-50">−</button>
                                                                <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                                                                <button onClick={() => handleUpdateQuantity(item.id, quantity + 1)}
                                                                    disabled={loadingItems[item.id]}
                                                                    className="px-3 py-2 text-purple-600 hover:bg-purple-50 disabled:opacity-50">+</button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => handleAddToCart(item.id)}
                                                                disabled={loadingItems[item.id]}
                                                                className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition disabled:opacity-50">
                                                                {loadingItems[item.id] ? 'Adding...' : 'Add'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Right Sidebar - Cart */}
                            <div className="w-full lg:w-80 lg:pt-8 flex-shrink-0 lg:sticky lg:top-0 lg:h-fit">
                                <div className="w-full space-y-6">
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cart</h3>

                                        {currentPageItems.length === 0 ? (
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 mx-auto mb-3 text-gray-300">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 text-sm">No items in your cart</p>
                                            </div>
                                        ) : (
                                            <>
                                                {currentPageItems.map((item, idx) => {
                                                    const itemPrice = item.discountPrice || item.price;
                                                    const itemTotal = itemPrice * item.quantity;
                                                    return (
                                                        <div key={idx} className="rounded-lg p-4 mb-4 border border-gray-100">
                                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                                <h4 className="text-sm font-medium text-gray-900 flex-1">{item.service.name}</h4>
                                                                <div className="flex items-center border border-gray-300 rounded-md">
                                                                    <button onClick={() => handleUpdateQuantity(item.service._id, item.quantity - 1)}
                                                                        className="px-2 py-1 text-purple-600 hover:bg-gray-100">−</button>
                                                                    <span className="px-3 py-1 text-sm">{item.quantity}</span>
                                                                    <button onClick={() => handleUpdateQuantity(item.service._id, item.quantity + 1)}
                                                                        className="px-2 py-1 text-purple-600 hover:bg-gray-100">+</button>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-semibold text-gray-900">₹{itemTotal}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                <NavLink to="/cart">
                                                    <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                                                        <div className="flex items-center justify-between px-4">
                                                            <span>₹{pageTotals.subtotal}</span>
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
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
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
                                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
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

                                        <button onClick={() => setShowAllOffers(!showAllOffers)}
                                            className="text-purple-600 text-sm font-semibold hover:text-purple-700 flex items-center gap-1">
                                            {showAllOffers ? 'View Less' : 'View More Offers'}
                                            {showAllOffers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {/* UC Promise */}
                                    <div className="rounded-lg border border-gray-200 px-6 py-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-semibold text-gray-900">UC Promise</h3>
                                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                                                <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_64,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1702985608819-4a9ba6.jpeg"
                                                    alt="UC Promise" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {['Verified Professionals', 'Hassle Free Booking', 'Transparent Pricing'].map((text, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" 
                                                            d="M9.75 15.836l9.793-9.793 1.414 1.415-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25 1.414-1.415 4.543 4.543z" 
                                                            fill="#0F0F0F" />
                                                    </svg>
                                                    <span className="text-sm text-gray-700">{text}</span>
                                                </div>
                                            ))}
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