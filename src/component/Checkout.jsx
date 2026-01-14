



import React, { useState, useRef, useEffect } from 'react';
import { 
    ChevronRight, X, MapPin, Phone, Clock, CreditCard, 
    AlertCircle, Check, Loader2, ShoppingCart, ChevronLeft,
    RefreshCw
} from 'lucide-react';
import {
    getAddresses,
    createAddress,
    createBooking,
    createRazorpayOrder,
    verifyPayment,
    cashPayment,
    getMyProfile,
    removeFromCart,
    clearCart,
    getAvailableSlots  
} from '../page/Api';

export default function Checkout() {

    const [checkoutItem, setCheckoutItem] = useState(null);

    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [mapAddress, setMapAddress] = useState('');
    const [userProfile, setUserProfile] = useState(null);

    const [slotsData, setSlotsData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotsError, setSlotsError] = useState(null);

    const [loading, setLoading] = useState(false);
    const [processingCheckout, setProcessingCheckout] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

    const [newAddress, setNewAddress] = useState({
        type: 'home',
        name: '',
        phone: '',
        houseNo: '',
        street: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
    });

    const scrollContainerRef = useRef(null);

    const paymentMethods = [
        { id: 'card', name: 'Credit/Debit Card', description: 'Instant payment via Razorpay', icon: 'card' },
        { id: 'upi', name: 'UPI', description: 'Pay using UPI apps', icon: 'upi' },
        { id: 'cash', name: 'Cash on Service', description: 'Pay after service completion', icon: 'cash' }
    ];

    const roundToTwo = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const formatPrice = (num) => {
        return Number(num).toFixed(2);
    };

    const fetchTimeSlots = async () => {
        try {
            setLoadingSlots(true);
            setSlotsError(null);
            
            const response = await getAvailableSlots(7); 
            
            if (response.success) {
                setSlotsData(response.data);
                
                if (response.data.slotsByDate && response.data.slotsByDate.length > 0) {
                    const firstDate = response.data.slotsByDate[0];
                    setSelectedDate(firstDate);
                    setTimeSlots(firstDate.slots || []);
                }
                
                // console.log(' Slots loaded:', response.data);
            } else {
                setSlotsError('Failed to load time slots');
            }
        } catch (err) {
            console.error('Error fetching slots:', err);
            setSlotsError(err.message || 'Failed to load time slots');
        } finally {
            setLoadingSlots(false);
        }
    };

     React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const handleDateSelect = (dateInfo) => {
        setSelectedDate(dateInfo);
        setTimeSlots(dateInfo.slots || []);
        setSelectedSlot(null); 
    };

    const handleSlotSelect = (slot) => {
        if (slot.available) {
            setSelectedSlot(slot);
            setShowSlotModal(false);
        }
    };

    const loadCheckoutItem = () => {
        const stored = sessionStorage.getItem('checkoutItem');
        if (stored) {
            const item = JSON.parse(stored);
            setCheckoutItem(item);
            // console.log(' Checkout item loaded:', item);
        } else {
            setError('No item selected for checkout');
        }
    };

    const fetchUserProfile = async () => {
        try {
            const response = await getMyProfile();
            if (response.success) {
                setUserProfile(response.data);
                setNewAddress(prev => ({
                    ...prev,
                    phone: response.data.phone || ''
                }));
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await getAddresses();
            if (response.success) {
                setAddresses(response.data);
                const defaultAddr = response.data.find(addr => addr.isDefault);
                if (defaultAddr) {
                    setSelectedAddress(defaultAddr);
                }
            }
        } catch (err) {
            console.error('Error fetching addresses:', err);
        }
    };

    const handleUpdateQuantity = (newQuantity) => {
        if (newQuantity < 1) return;
        
        const price = Number(checkoutItem.discountPrice || checkoutItem.price) || 0;
        
        const updated = {
            ...checkoutItem,
            quantity: newQuantity,
            totalPrice: roundToTwo(price * newQuantity)
        };
        setCheckoutItem(updated);
        sessionStorage.setItem('checkoutItem', JSON.stringify(updated));
    };

    const handleUseCurrentLocation = async () => {
        setGettingLocation(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setGettingLocation(false);
            return;
        }

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                });
            });

            const { latitude, longitude } = position.coords;
            setMapCenter({ lat: latitude, lng: longitude });
            setShowMapModal(true);
            setShowAddressModal(false);

            const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
            const response = await fetch(apiUrl, {
                headers: { 'User-Agent': 'Service Booking App' }
            });

            if (!response.ok) throw new Error('Failed to get address');

            const data = await response.json();
            const address = data.address || {};

            setNewAddress(prev => ({
                ...prev,
                houseNo: address.house_number || prev.houseNo,
                street: address.road || address.street || prev.street,
                city: address.city || address.town || prev.city,
                state: address.state || prev.state,
                pincode: address.postcode || prev.pincode,
                landmark: address.suburb || prev.landmark
            }));

            setMapAddress(data.display_name);
            setSuccess('Location detected successfully');
            setTimeout(() => setSuccess(null), 3000);

        } catch (err) {
            console.error('Error getting location:', err);
            setError(err.code === 1 ? 'Location permission denied' : 'Could not get location');
        } finally {
            setGettingLocation(false);
        }
    };

    const handleCreateAddress = async (e) => {
        e.preventDefault();

        if (!newAddress.name.trim() || !newAddress.phone.trim() || !newAddress.houseNo.trim()) {
            setError('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            const response = await createAddress(newAddress);
            if (response.success) {
                setAddresses([...addresses, response.data]);
                setSelectedAddress(response.data);
                setSuccess('Address saved successfully');
                setShowMapModal(false);
                setShowAddressModal(false);
                setNewAddress({
                    type: 'home',
                    name: '',
                    phone: userProfile?.phone || '',
                    houseNo: '',
                    street: '',
                    landmark: '',
                    city: '',
                    state: '',
                    pincode: '',
                    isDefault: false
                });
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            setError(err.message || 'Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const clearCartAfterBooking = async () => {
        try {
            // console.log(' Clearing cart after booking...');
            
            const item = sessionStorage.getItem('checkoutItem');
            
            if (item) {
                const parsedItem = JSON.parse(item);
                
                if (parsedItem.service?._id) {
                    console.log('Removing service from cart:', parsedItem.service._id);
                    await removeFromCart(parsedItem.service._id);
                } else {
                    console.log('Clearing entire cart');
                    await clearCart();
                }
                
                sessionStorage.removeItem('checkoutItem');
                window.dispatchEvent(new Event('cartUpdated'));
                
                // console.log(' Cart cleared successfully');
            }
            
        } catch (error) {
            console.error(' Failed to clear cart (booking is still successful):', error);
        }
    };

    const handlePayment = async (bookingId) => {
        try {
            if (selectedPaymentMethod === 'cash') {
                const response = await cashPayment(bookingId);
                if (response.success) {
                    await clearCartAfterBooking();
                    setSuccess(' Order placed successfully with Cash on Service!');
                    setTimeout(() => {
                        window.location.href = `/booking/${bookingId}`;
                    }, 2000);
                }
                return;
            }

            
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setError('Failed to load payment gateway');
                return;
            }

            const orderResponse = await createRazorpayOrder(bookingId);
            if (!orderResponse.success) {
                throw new Error('Failed to create order');
            }

            const options = {
                key: orderResponse.data.keyId,
                amount: orderResponse.data.amount,
                currency: orderResponse.data.currency,
                order_id: orderResponse.data.orderId,
                name: 'Urban Company',
                description: 'Service Booking Payment',
                handler: async function (response) {
                    try {
                        const verifyResponse = await verifyPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            bookingId: bookingId
                        });

                        if (verifyResponse.success) {
                            await clearCartAfterBooking();
                            setSuccess(' Payment successful! Redirecting...');
                            setTimeout(() => {
                                window.location.href = `/booking/${bookingId}`;
                            }, 2000);
                        }
                    } catch (err) {
                        setError('Payment verification failed. Please contact support.');
                        setProcessingCheckout(false);
                    }
                },
                prefill: {
                    name: userProfile?.name || '',
                    contact: userProfile?.phone || ''
                },
                theme: {
                    color: '#7C3AED'
                },
                modal: {
                    ondismiss: function () {
                        setProcessingCheckout(false);
                        setError('Payment cancelled');
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            setError(err.message || 'Payment failed. Please try again.');
            setProcessingCheckout(false);
        }
    };

    const handlePlaceOrder = async () => {
       
        if (!selectedAddress) {
            setError(' Please select a delivery address');
            return;
        }
        if (!selectedSlot) {
            setError(' Please select a time slot');
            return;
        }
        if (!selectedPaymentMethod) {
            setError('Please select a payment method');
            return;
        }
        if (!checkoutItem) {
            setError(' No item selected');
            return;
        }

        try {
            setProcessingCheckout(true);
            setError(null);

            const premiumCharge = selectedSlot.isPremium ? (selectedSlot.premiumCharge || 0) : 0;
            const finalTotal = roundToTwo(totalAmount + premiumCharge);

            const bookingData = {
                service: checkoutItem.service._id,
                address: selectedAddress._id,
                scheduledDate: selectedSlot.date,
                scheduledTime: selectedSlot.time,
                price: subtotal,
                tax: tax,
                totalAmount: finalTotal,
                premiumCharge: premiumCharge,
                notes: `Service: ${checkoutItem.service.name}, Quantity: ${checkoutItem.quantity}${premiumCharge > 0 ? ', Premium Slot' : ''}`
            };

            console.log('Creating booking with data:', bookingData);

            const bookingResponse = await createBooking(bookingData);

            if (!bookingResponse.success) {
                throw new Error(bookingResponse.message || 'Failed to create booking');
            }

            const booking = bookingResponse.data;
            console.log(' Booking created:', booking);

            await handlePayment(booking._id);

        } catch (err) {
            console.error(' Checkout error:', err);
            setError(err.message || 'Failed to place order. Please try again.');
            setProcessingCheckout(false);
        }
    };

    const itemPrice = checkoutItem ? roundToTwo(Number(checkoutItem.discountPrice || checkoutItem.price) || 0) : 0;
    const subtotal = checkoutItem ? roundToTwo(itemPrice * (checkoutItem.quantity || 1)) : 0;
    const tax = roundToTwo(subtotal * 0.18);
    const premiumCharge = selectedSlot?.isPremium ? (selectedSlot.premiumCharge || 0) : 0;
    const totalAmount = roundToTwo(subtotal + tax + premiumCharge);

    useEffect(() => {
        const init = async () => {
            setFetchingData(true);
            loadCheckoutItem();
            await fetchUserProfile();
            await fetchAddresses();
            await fetchTimeSlots(); 
            setFetchingData(false);
        };
        init();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (selectedDate) {
                fetchTimeSlots(); 
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [selectedDate]);

    if (fetchingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
                    <p className="text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (!checkoutItem) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No item selected for checkout</p>
                    <a href="/cart" className="text-purple-600 font-semibold hover:underline">
                        Go to Cart
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => window.history.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">UC</span>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
                    </div>
                </div>
            </header>

            {success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-800">{success}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-800 flex-1">{error}</p>
                        <button onClick={() => setError(null)}>
                            <X className="w-4 h-4 text-red-600" />
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    <div className="space-y-6">
                        
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Send booking details to</h3>
                                    <p className="text-sm text-gray-600">+91 {userProfile?.phone || '9876543210'}</p>
                                </div>
                                <Check className="w-5 h-5 text-green-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Service Address</h3>
                                    {selectedAddress ? (
                                        <div className="text-sm text-gray-600 mt-2">
                                            <p className="font-medium text-gray-900 capitalize">{selectedAddress.type}</p>
                                            <p>{selectedAddress.houseNo}, {selectedAddress.street}</p>
                                            {selectedAddress.landmark && <p>Near {selectedAddress.landmark}</p>}
                                            <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 mt-2">No address selected</p>
                                    )}
                                </div>
                                {selectedAddress && <Check className="w-5 h-5 text-green-500" />}
                            </div>
                            <button
                                onClick={() => setShowAddressModal(true)}
                                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                            >
                                {selectedAddress ? 'Change Address' : 'Select Address'}
                            </button>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <Clock className={`w-5 h-5 mt-0.5 ${selectedSlot ? 'text-gray-600' : 'text-gray-400'}`} />
                                <div className="flex-1">
                                    <h3 className={`font-semibold mb-1 ${selectedSlot ? 'text-gray-900' : 'text-gray-400'}`}>
                                        Time Slot
                                    </h3>
                                    {selectedSlot ? (
                                        <div className="text-sm text-gray-600">
                                            <p>{selectedSlot.displayDate}</p>
                                            <p className="font-medium">{selectedSlot.time}</p>
                                            {selectedSlot.isPremium && (
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                                    Premium Slot (+₹{selectedSlot.premiumCharge})
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No slot selected</p>
                                    )}
                                </div>
                                {selectedSlot && <Check className="w-5 h-5 text-green-500" />}
                            </div>
                            <button
                                onClick={() => setShowSlotModal(true)}
                                disabled={!selectedAddress}
                                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {selectedSlot ? 'Change Slot' : 'Select Time Slot'}
                            </button>
                            {!selectedAddress && (
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Please select address first
                                </p>
                            )}
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <CreditCard className={`w-5 h-5 mt-0.5 ${selectedPaymentMethod ? 'text-gray-600' : 'text-gray-400'}`} />
                                <div className="flex-1">
                                    <h3 className={`font-semibold mb-1 ${selectedPaymentMethod ? 'text-gray-900' : 'text-gray-400'}`}>
                                        Payment Method
                                    </h3>
                                    {selectedPaymentMethod ? (
                                        <p className="text-sm text-gray-600">
                                            {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-500">No method selected</p>
                                    )}
                                </div>
                                {selectedPaymentMethod && <Check className="w-5 h-5 text-green-500" />}
                            </div>
                            <button
                                onClick={() => setShowPaymentModal(true)}
                                disabled={!selectedSlot}
                                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {selectedPaymentMethod ? 'Change Payment Method' : 'Select Payment Method'}
                            </button>
                            {!selectedSlot && (
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Please select time slot first
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="relative lg:max-w-xl">
                        <div ref={scrollContainerRef} className="overflow-y-auto pb-28" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                            <div className="space-y-6 pr-4">
                                
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
                                    <div className="flex gap-4 mb-4">
                                        {checkoutItem.service.images && checkoutItem.service.images[0] && (
                                            <img
                                                src={`${checkoutItem.service.images[0]}`}
                                                alt={checkoutItem.service.name}
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-1">{checkoutItem.service.name}</h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">{checkoutItem.service.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="flex items-center border border-gray-300 rounded-md">
                                            <button
                                                onClick={() => handleUpdateQuantity(checkoutItem.quantity - 1)}
                                                disabled={loading || checkoutItem.quantity <= 1}
                                                className="px-3 py-1 text-purple-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                −
                                            </button>
                                            <span className="px-4 py-1 border-x border-gray-300 text-sm font-medium">
                                                {checkoutItem.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(checkoutItem.quantity + 1)}
                                                disabled={loading}
                                                className="px-3 py-1 text-purple-600 hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-gray-900">₹{formatPrice(itemPrice)}</p>
                                            {checkoutItem.discountPrice && checkoutItem.price !== checkoutItem.discountPrice && (
                                                <p className="text-sm text-gray-500 line-through">₹{formatPrice(checkoutItem.price)}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                Item Total ({checkoutItem.quantity} × ₹{formatPrice(itemPrice)})
                                            </span>
                                            <span className="font-medium">₹{formatPrice(subtotal)}</span>
                                        </div>
                                        
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Taxes & Fee (18%)</span>
                                            <span className="font-medium">₹{formatPrice(tax)}</span>
                                        </div>
                                        
                                        {premiumCharge > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-yellow-600">Premium Slot Charge</span>
                                                <span className="font-medium text-yellow-600">+₹{formatPrice(premiumCharge)}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between pt-3 border-t border-gray-200">
                                            <span className="font-semibold text-gray-900">Amount to Pay</span>
                                            <span className="text-xl font-bold text-purple-600">₹{formatPrice(totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <span className="text-green-600 text-lg">%</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Apply Coupon</p>
                                                <p className="text-xs text-gray-500">Get extra discount</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="fixed bottom-0 left-0 right-0 lg:left-auto lg:right-auto lg:max-w-xl w-full bg-white border-t-2 border-gray-200 p-4 shadow-lg z-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Amount to Pay</p>
                                    <p className="text-2xl font-bold text-gray-900">₹{formatPrice(totalAmount)}</p>
                                </div>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={!selectedAddress || !selectedSlot || !selectedPaymentMethod || processingCheckout}
                                    className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {processingCheckout ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Place Order'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showAddressModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                   <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 scrollbar-hide">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Select Address</h2>
                            <button onClick={() => setShowAddressModal(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <button
                            onClick={handleUseCurrentLocation}
                            disabled={gettingLocation}
                            className="w-full flex items-center justify-center gap-3 p-4 text-purple-600 hover:bg-purple-50 rounded-lg transition disabled:opacity-50 mb-6 border-2 border-purple-200"
                        >
                            {gettingLocation ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="font-semibold">Getting location...</span>
                                </>
                            ) : (
                                <>
                                    <MapPin className="w-5 h-5" />
                                    <span className="font-semibold">Use Current Location</span>
                                </>
                            )}
                        </button>

                        {addresses.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900">Saved Addresses</h3>
                                {addresses.map((addr) => (
                                    <button
                                        key={addr._id}
                                        onClick={() => {
                                            setSelectedAddress(addr);
                                            setShowAddressModal(false);
                                        }}
                                        className={`w-full text-left p-4 border-2 rounded-lg transition ${
                                            selectedAddress?._id === addr._id
                                                ? 'border-purple-600 bg-purple-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900 capitalize flex items-center gap-2">
                                                    {addr.type}
                                                    {addr.isDefault && (
                                                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">
                                                            Default
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {addr.houseNo}, {addr.street}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {addr.city}, {addr.state} {addr.pincode}
                                                </p>
                                            </div>
                                            {selectedAddress?._id === addr._id && (
                                                <Check className="w-5 h-5 text-purple-600" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {addresses.length === 0 && (
                            <div className="text-center py-8">
                                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No saved addresses</p>
                                <p className="text-sm text-gray-400">Use current location to add a new address</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showMapModal && mapCenter && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex overflow-hidden">
                      
                        <button
                            onClick={() => setShowMapModal(false)}
                            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex-1 relative bg-gray-100">
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 0.01},${mapCenter.lat - 0.01},${mapCenter.lng + 0.01},${mapCenter.lat + 0.01}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`}
                                title="Location Map"
                            />
                        </div>

                        <div className="w-96 bg-white flex flex-col">
                            <div className="p-6 border-b">
                                <h3 className="font-semibold text-gray-900">
                                    {mapAddress.split(',')[0] || 'Current Location'}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{mapAddress}</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                <form onSubmit={handleCreateAddress} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            value={newAddress.houseNo}
                                            onChange={(e) => setNewAddress(prev => ({ ...prev, houseNo: e.target.value }))}
                                            placeholder="House/Flat Number *"
                                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={newAddress.street}
                                            onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                                            placeholder="Street/Area *"
                                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={newAddress.landmark}
                                            onChange={(e) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
                                            placeholder="Landmark (Optional)"
                                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                                            placeholder="City *"
                                            className="px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={newAddress.state}
                                            onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                                            placeholder="State *"
                                            className="px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={newAddress.pincode}
                                            onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                                            placeholder="Pincode *"
                                            maxLength={6}
                                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={newAddress.name}
                                            onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Contact Name *"
                                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            value={newAddress.phone}
                                            onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                                            placeholder="Phone Number *"
                                            maxLength={10}
                                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Save as</p>
                                        <div className="flex gap-3">
                                            {['home', 'work', 'other'].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setNewAddress(prev => ({ ...prev, type }))}
                                                    className={`flex-1 py-2 rounded-lg border-2 font-medium capitalize transition ${
                                                        newAddress.type === type
                                                            ? 'border-purple-600 bg-purple-50 text-purple-600'
                                                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                                    }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t">
                                <button
                                    onClick={handleCreateAddress}
                                    disabled={loading || !newAddress.name || !newAddress.phone || !newAddress.houseNo}
                                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Address'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSlotModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
                      
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold">Select Time Slot</h2>
                            <div className="flex items-center gap-2">
                               
                                <button
                                    onClick={fetchTimeSlots}
                                    disabled={loadingSlots}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                    title="Refresh slots"
                                >
                                    <RefreshCw className={`w-5 h-5 text-gray-600 ${loadingSlots ? 'animate-spin' : ''}`} />
                                </button>
                                <button onClick={() => setShowSlotModal(false)}>
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {loadingSlots && !slotsData ? (
                            <div className="p-8 text-center">
                                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
                                <p className="text-gray-600">Loading available slots...</p>
                            </div>
                        ) : slotsError ? (
                            <div className="p-8 text-center">
                                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                                <p className="text-red-600 mb-4">{slotsError}</p>
                                <button
                                    onClick={fetchTimeSlots}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="p-4 border-b bg-gray-50">
                                    <p className="text-sm text-gray-600 mb-3 font-medium">Select Date</p>
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {slotsData?.slotsByDate?.map((dateInfo) => {
                                         
                                            const availableCount = dateInfo.slots?.filter(s => s.available).length || 0;
                                            
                                            return (
                                                <button
                                                    key={dateInfo.dateString}
                                                    onClick={() => handleDateSelect(dateInfo)}
                                                    className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 text-center min-w-[90px] transition ${
                                                        selectedDate?.dateString === dateInfo.dateString
                                                            ? 'border-purple-600 bg-purple-50'
                                                            : availableCount === 0
                                                                ? 'border-gray-200 bg-gray-100 opacity-60'
                                                                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                                    }`}
                                                >
                                                    <p className={`text-xs font-medium ${
                                                        selectedDate?.dateString === dateInfo.dateString 
                                                            ? 'text-purple-600' 
                                                            : 'text-gray-500'
                                                    }`}>
                                                        {dateInfo.displayLabel}
                                                    </p>
                                                    <p className={`text-sm font-bold mt-1 ${
                                                        selectedDate?.dateString === dateInfo.dateString 
                                                            ? 'text-purple-700' 
                                                            : 'text-gray-900'
                                                    }`}>
                                                        {dateInfo.displayDate}
                                                    </p>
                                                    {availableCount > 0 ? (
                                                        <p className="text-xs text-green-600 mt-1">
                                                            {availableCount} slots
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-red-500 mt-1">
                                                            No slots
                                                        </p>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                               <div className="p-4 overflow-y-auto max-h-[50vh] scrollbar-hide">
                                    <p className="text-sm text-gray-600 mb-3">
                                        Slots for <span className="font-semibold">{selectedDate?.displayLabel}, {selectedDate?.displayDate}</span>
                                    </p>
                                    
                                    <div className="space-y-2">
                                        {timeSlots.map((slot, index) => (
                                            <button
                                                key={`${slot.date}-${slot.startTime}-${index}`}
                                                onClick={() => handleSlotSelect(slot)}
                                                disabled={!slot.available}
                                                className={`w-full p-4 border-2 rounded-xl text-left transition ${
                                                    selectedSlot?.time === slot.time && selectedSlot?.date === slot.date
                                                        ? 'border-purple-600 bg-purple-50'
                                                        : slot.available
                                                            ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                                            : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                            slot.available 
                                                                ? 'bg-green-100' 
                                                                : 'bg-gray-200'
                                                        }`}>
                                                            <Clock className={`w-5 h-5 ${
                                                                slot.available 
                                                                    ? 'text-green-600' 
                                                                    : 'text-gray-400'
                                                            }`} />
                                                        </div>
                                                        <div>
                                                            <p className={`font-semibold ${
                                                                slot.available 
                                                                    ? 'text-gray-900' 
                                                                    : 'text-gray-500'
                                                            }`}>
                                                                {slot.time}
                                                            </p>
                                                            {!slot.available && slot.unavailableReason && (
                                                                <p className="text-xs text-red-500 mt-0.5">
                                                                    {slot.unavailableReason}
                                                                </p>
                                                            )}
                                                            {slot.available && slot.remainingSlots <= 3 && (
                                                                <p className="text-xs text-orange-500 mt-0.5">
                                                                     Only {slot.remainingSlots} slots left!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                     
                                                        {slot.isPremium && slot.available && (
                                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                                                                +₹{slot.premiumCharge}
                                                            </span>
                                                        )}
                                                        
                                                        {slot.available && (
                                                            <div className="text-right">
                                                                <span className="text-xs text-green-600 font-medium">
                                                                    {slot.remainingSlots}/{slot.maxSlots}
                                                                </span>
                                                                {selectedSlot?.time === slot.time && selectedSlot?.date === slot.date && (
                                                                    <Check className="w-5 h-5 text-purple-600 ml-2 inline" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {timeSlots.length === 0 && (
                                        <div className="text-center py-8">
                                            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-600 font-medium">No time slots configured</p>
                                            <p className="text-sm text-gray-500 mt-1">Please contact support</p>
                                        </div>
                                    )}

                                    {timeSlots.length > 0 && timeSlots.every(slot => !slot.available) && (
                                        <div className="text-center py-8">
                                            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-600 font-medium">No slots available for this date</p>
                                            <p className="text-sm text-gray-500 mt-1">Please select another date</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 border-t bg-gray-50">
                                    <p className="text-xs text-gray-500 text-center">
                                         Slots are updated in real-time. Book early to secure your preferred time.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Select Payment Method</h2>
                            <button onClick={() => setShowPaymentModal(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => {
                                        setSelectedPaymentMethod(method.id);
                                        setShowPaymentModal(false);
                                    }}
                                    className={`w-full p-4 border-2 rounded-xl text-left transition ${
                                        selectedPaymentMethod === method.id
                                            ? 'border-purple-600 bg-purple-50'
                                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                method.id === 'cash' ? 'bg-green-100' : 'bg-blue-100'
                                            }`}>
                                                <CreditCard className={`w-5 h-5 ${
                                                    method.id === 'cash' ? 'text-green-600' : 'text-blue-600'
                                                }`} />
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-900">{method.name}</span>
                                                <p className="text-xs text-gray-500">{method.description}</p>
                                            </div>
                                        </div>
                                        {selectedPaymentMethod === method.id && (
                                            <Check className="w-5 h-5 text-purple-600" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-700">
                                 Online payments are processed securely via Razorpay. Your card details are never stored.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

