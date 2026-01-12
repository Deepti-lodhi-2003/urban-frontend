// import React, { useState, useRef, useEffect } from 'react';
// import { ChevronRight, X, MapPin, Phone, Clock, CreditCard, AlertCircle, Check, Loader2, ShoppingCart } from 'lucide-react';
// import {
//     getAddresses,
//     createAddress,
//     createBooking,
//     createRazorpayOrder,
//     verifyPayment,
//     cashPayment,
//     getMyProfile
// } from '../page/Api';

// export default function Checkout() {
//     // Single Item State
//     const [checkoutItem, setCheckoutItem] = useState(null);

//     // Modals
//     const [showAddressModal, setShowAddressModal] = useState(false);
//     const [showSlotModal, setShowSlotModal] = useState(false);
//     const [showPaymentModal, setShowPaymentModal] = useState(false);
//     const [showMapModal, setShowMapModal] = useState(false);

//     // Data
//     const [addresses, setAddresses] = useState([]);
//     const [selectedAddress, setSelectedAddress] = useState(null);
//     const [selectedSlot, setSelectedSlot] = useState(null);
//     const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
//     const [mapCenter, setMapCenter] = useState(null);
//     const [mapAddress, setMapAddress] = useState('');
//     const [userProfile, setUserProfile] = useState(null);

//     // Loading & Messages
//     const [loading, setLoading] = useState(false);
//     const [processingCheckout, setProcessingCheckout] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const [gettingLocation, setGettingLocation] = useState(false);
//     const [fetchingData, setFetchingData] = useState(true);

//     // New Address Form
//     const [newAddress, setNewAddress] = useState({
//         type: 'home',
//         name: '',
//         phone: '',
//         houseNo: '',
//         street: '',
//         landmark: '',
//         city: '',
//         state: '',
//         pincode: '',
//         isDefault: false
//     });

//     const scrollContainerRef = useRef(null);

//     const timeSlots = [
//         { id: 1, date: "2025-01-09", displayDate: "Today, Jan 09", time: "09:00 AM - 12:00 PM", available: true },
//         { id: 2, date: "2025-01-09", displayDate: "Today, Jan 09", time: "12:00 PM - 03:00 PM", available: true },
//         { id: 3, date: "2025-01-09", displayDate: "Today, Jan 09", time: "03:00 PM - 06:00 PM", available: false },
//         { id: 4, date: "2025-01-10", displayDate: "Tomorrow, Jan 10", time: "09:00 AM - 12:00 PM", available: true },
//         { id: 5, date: "2025-01-10", displayDate: "Tomorrow, Jan 10", time: "12:00 PM - 03:00 PM", available: true }
//     ];

//     const paymentMethods = [
//         { id: 'card', name: 'Credit/Debit Card', description: 'Instant payment', icon: 'card' },
//         { id: 'upi', name: 'UPI', description: 'Instant payment', icon: 'upi' },
//         { id: 'cash', name: 'Cash on Service', description: 'Pay after service', icon: 'cash' }
//     ];

//     //  Decimal Calculation Helper Functions
//     const roundToTwo = (num) => {
//         return Math.round((num + Number.EPSILON) * 100) / 100;
//     };

//     const formatPrice = (num) => {
//         return Number(num).toFixed(2);
//     };

//     // Load checkout item from sessionStorage
//     const loadCheckoutItem = () => {
//         const stored = sessionStorage.getItem('checkoutItem');
//         if (stored) {
//             const item = JSON.parse(stored);
//             setCheckoutItem(item);
//             console.log(' Checkout item loaded:', item);
//         } else {
//             setError('No item selected for checkout');
//         }
//     };

//     // Fetch user profile
//     const fetchUserProfile = async () => {
//         try {
//             const response = await getMyProfile();
//             if (response.success) {
//                 setUserProfile(response.data);
//                 setNewAddress(prev => ({
//                     ...prev,
//                     phone: response.data.phone || ''
//                 }));
//             }
//         } catch (err) {
//             console.error('Error fetching profile:', err);
//         }
//     };

//     // Fetch Addresses
//     const fetchAddresses = async () => {
//         try {
//             const response = await getAddresses();
//             if (response.success) {
//                 setAddresses(response.data);
//                 const defaultAddr = response.data.find(addr => addr.isDefault);
//                 if (defaultAddr) {
//                     setSelectedAddress(defaultAddr);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching addresses:', err);
//         }
//     };

//     // Update quantity
//     const handleUpdateQuantity = (newQuantity) => {
//         if (newQuantity < 1) return;
        
//         const price = Number(checkoutItem.discountPrice || checkoutItem.price) || 0;
        
//         const updated = {
//             ...checkoutItem,
//             quantity: newQuantity,
//             totalPrice: roundToTwo(price * newQuantity)
//         };
//         setCheckoutItem(updated);
//         sessionStorage.setItem('checkoutItem', JSON.stringify(updated));
//     };

//     // Get current location
//     const handleUseCurrentLocation = async () => {
//         setGettingLocation(true);
//         setError(null);

//         if (!navigator.geolocation) {
//             setError('Geolocation is not supported by your browser');
//             setGettingLocation(false);
//             return;
//         }

//         try {
//             const position = await new Promise((resolve, reject) => {
//                 navigator.geolocation.getCurrentPosition(resolve, reject, {
//                     enableHighAccuracy: true,
//                     timeout: 15000,
//                     maximumAge: 0
//                 });
//             });

//             const { latitude, longitude } = position.coords;
//             setMapCenter({ lat: latitude, lng: longitude });
//             setShowMapModal(true);
//             setShowAddressModal(false);

//             const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
//             const response = await fetch(apiUrl, {
//                 headers: { 'User-Agent': 'Urban Company Checkout App' }
//             });

//             if (!response.ok) throw new Error('Failed to get address');

//             const data = await response.json();
//             const address = data.address || {};

//             setNewAddress(prev => ({
//                 ...prev,
//                 houseNo: address.house_number || prev.houseNo,
//                 street: address.road || address.street || prev.street,
//                 city: address.city || address.town || prev.city,
//                 state: address.state || prev.state,
//                 pincode: address.postcode || prev.pincode,
//                 landmark: address.suburb || prev.landmark
//             }));

//             setMapAddress(data.display_name);
//             setSuccess('Location detected successfully');
//             setTimeout(() => setSuccess(null), 3000);

//         } catch (err) {
//             console.error('Error getting location:', err);
//             setError(err.code === 1 ? 'Location permission denied' : 'Could not get location');
//         } finally {
//             setGettingLocation(false);
//         }
//     };

//     // Create new address
//     const handleCreateAddress = async (e) => {
//         e.preventDefault();

//         if (!newAddress.name.trim() || !newAddress.phone.trim() || !newAddress.houseNo.trim()) {
//             setError('Please fill all required fields');
//             return;
//         }

//         try {
//             setLoading(true);
//             const response = await createAddress(newAddress);
//             if (response.success) {
//                 setAddresses([...addresses, response.data]);
//                 setSelectedAddress(response.data);
//                 setSuccess('Address saved successfully');
//                 setShowMapModal(false);
//                 setShowAddressModal(false);
//                 setNewAddress({
//                     type: 'home',
//                     name: '',
//                     phone: userProfile?.phone || '',
//                     houseNo: '',
//                     street: '',
//                     landmark: '',
//                     city: '',
//                     state: '',
//                     pincode: '',
//                     isDefault: false
//                 });
//                 setTimeout(() => setSuccess(null), 3000);
//             }
//         } catch (err) {
//             setError(err.message || 'Failed to save address');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Load Razorpay Script
//     const loadRazorpayScript = () => {
//         return new Promise((resolve) => {
//             const script = document.createElement('script');
//             script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//             script.onload = () => resolve(true);
//             script.onerror = () => resolve(false);
//             document.body.appendChild(script);
//         });
//     };

//     // Handle Payment
//     const handlePayment = async (bookingId) => {
//         try {
//             if (selectedPaymentMethod === 'cash') {
//                 const response = await cashPayment(bookingId);
//                 if (response.success) {
//                     setSuccess(' Order placed successfully with Cash on Service!');
//                     setTimeout(() => {
//                         window.location.href = `/booking/${bookingId}`;
//                     }, 2000);
//                 }
//                 return;
//             }

//             const scriptLoaded = await loadRazorpayScript();
//             if (!scriptLoaded) {
//                 setError('Failed to load payment gateway');
//                 return;
//             }

//             const orderResponse = await createRazorpayOrder(bookingId);
//             if (!orderResponse.success) {
//                 throw new Error('Failed to create order');
//             }

//             const options = {
//                 key: orderResponse.data.keyId,
//                 amount: orderResponse.data.amount,
//                 currency: orderResponse.data.currency,
//                 order_id: orderResponse.data.orderId,
//                 name: 'Urban Company',
//                 description: 'Service Booking Payment',
//                 handler: async function (response) {
//                     try {
//                         const verifyResponse = await verifyPayment({
//                             razorpayOrderId: response.razorpay_order_id,
//                             razorpayPaymentId: response.razorpay_payment_id,
//                             razorpaySignature: response.razorpay_signature,
//                             bookingId: bookingId
//                         });

//                         if (verifyResponse.success) {
//                             setSuccess(' Payment successful! Redirecting...');
//                             setTimeout(() => {
//                                 window.location.href = `/booking/${bookingId}`;
//                             }, 2000);
//                         }
//                     } catch (err) {
//                         setError('Payment verification failed. Please contact support.');
//                         setProcessingCheckout(false);
//                     }
//                 },
//                 prefill: {
//                     name: userProfile?.name || '',
//                     contact: userProfile?.phone || ''
//                 },
//                 theme: {
//                     color: '#7C3AED'
//                 },
//                 modal: {
//                     ondismiss: function () {
//                         setProcessingCheckout(false);
//                         setError('Payment cancelled');
//                     }
//                 }
//             };

//             const razorpay = new window.Razorpay(options);
//             razorpay.open();
//         } catch (err) {
//             setError(err.message || 'Payment failed. Please try again.');
//             setProcessingCheckout(false);
//         }
//     };

//     // Place Order
//     const handlePlaceOrder = async () => {
//         if (!selectedAddress) {
//             setError('⚠️ Please select a delivery address');
//             return;
//         }
//         if (!selectedSlot) {
//             setError('⚠️ Please select a time slot');
//             return;
//         }
//         if (!selectedPaymentMethod) {
//             setError('⚠️ Please select a payment method');
//             return;
//         }
//         if (!checkoutItem) {
//             setError('⚠️ No item selected');
//             return;
//         }

//         try {
//             setProcessingCheckout(true);
//             setError(null);

//             const bookingData = {
//                 service: checkoutItem.service._id,
//                 address: selectedAddress._id,
//                 scheduledDate: selectedSlot.date,
//                 scheduledTime: selectedSlot.time,
//                 notes: `Service: ${checkoutItem.service.name}, Quantity: ${checkoutItem.quantity}`
//             };

//             console.log('Creating booking with data:', bookingData);

//             const bookingResponse = await createBooking(bookingData);

//             if (!bookingResponse.success) {
//                 throw new Error('Failed to create booking');
//             }

//             const booking = bookingResponse.data;
//             console.log(' Booking created:', booking);

//             await handlePayment(booking._id);

//         } catch (err) {
//             console.error('❌ Checkout error:', err);
//             setError(err.message || 'Failed to place order. Please try again.');
//             setProcessingCheckout(false);
//         }
//     };

//     //  Decimal Calculations
//     const itemPrice = checkoutItem ? roundToTwo(Number(checkoutItem.discountPrice || checkoutItem.price) || 0) : 0;
//     const subtotal = checkoutItem ? roundToTwo(itemPrice * (checkoutItem.quantity || 1)) : 0;
//     const tax = roundToTwo(subtotal * 0.18);
//     const totalAmount = roundToTwo(subtotal + tax);

//     useEffect(() => {
//         const init = async () => {
//             setFetchingData(true);
//             loadCheckoutItem();
//             await fetchUserProfile();
//             await fetchAddresses();
//             setFetchingData(false);
//         };
//         init();
//     }, []);

//     if (fetchingData) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
//             </div>
//         );
//     }

//     if (!checkoutItem) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                     <p className="text-gray-600 mb-4">No item selected for checkout</p>
//                     <a href="/cart" className="text-purple-600 font-semibold hover:underline">
//                         Go to Cart
//                     </a>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//                     <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
//                             <span className="text-white font-bold text-sm">UC</span>
//                         </div>
//                         <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
//                     </div>
//                 </div>
//             </header>

//             {success && (
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
//                     <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
//                         <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
//                         <p className="text-sm text-green-800">{success}</p>
//                     </div>
//                 </div>
//             )}

//             {error && (
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
//                         <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//                         <p className="text-sm text-red-800 flex-1">{error}</p>
//                         <button onClick={() => setError(null)}>
//                             <X className="w-4 h-4 text-red-600" />
//                         </button>
//                     </div>
//                 </div>
//             )}

//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     <div className="space-y-6">
//                         <div className="bg-white rounded-lg border border-gray-200 p-6">
//                             <div className="flex items-start gap-3">
//                                 <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
//                                 <div className="flex-1">
//                                     <h3 className="font-semibold text-gray-900 mb-1">Send booking details to</h3>
//                                     <p className="text-sm text-gray-600">+91 {userProfile?.phone || '9876543210'}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white rounded-lg border border-gray-200 p-6">
//                             <div className="flex items-start gap-3 mb-4">
//                                 <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
//                                 <div className="flex-1">
//                                     <h3 className="font-semibold text-gray-900 mb-1">Delivery Address</h3>
//                                     {selectedAddress ? (
//                                         <div className="text-sm text-gray-600 mt-2">
//                                             <p className="font-medium text-gray-900 capitalize">{selectedAddress.type}</p>
//                                             <p>{selectedAddress.houseNo}, {selectedAddress.street}</p>
//                                             <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}</p>
//                                         </div>
//                                     ) : (
//                                         <p className="text-sm text-gray-500 mt-2">No address selected</p>
//                                     )}
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={() => setShowAddressModal(true)}
//                                 className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
//                             >
//                                 {selectedAddress ? 'Change address' : 'Select address'}
//                             </button>
//                         </div>

//                         <div className="bg-white rounded-lg border border-gray-200 p-6">
//                             <div className="flex items-start gap-3 mb-4">
//                                 <Clock className={`w-5 h-5 mt-0.5 ${selectedSlot ? 'text-gray-600' : 'text-gray-400'}`} />
//                                 <div className="flex-1">
//                                     <h3 className={`font-semibold mb-1 ${selectedSlot ? 'text-gray-900' : 'text-gray-400'}`}>Time Slot</h3>
//                                     {selectedSlot ? (
//                                         <p className="text-sm text-gray-600">{selectedSlot.displayDate} • {selectedSlot.time}</p>
//                                     ) : (
//                                         <p className="text-sm text-gray-500">No slot selected</p>
//                                     )}
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={() => setShowSlotModal(true)}
//                                 disabled={!selectedAddress}
//                                 className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
//                             >
//                                 {selectedSlot ? 'Change slot' : 'Select slot'}
//                             </button>
//                             {!selectedAddress && (
//                                 <p className="text-xs text-gray-500 mt-2 text-center">Please select address first</p>
//                             )}
//                         </div>

//                         <div className="bg-white rounded-lg border border-gray-200 p-6">
//                             <div className="flex items-start gap-3 mb-4">
//                                 <CreditCard className={`w-5 h-5 mt-0.5 ${selectedPaymentMethod ? 'text-gray-600' : 'text-gray-400'}`} />
//                                 <div className="flex-1">
//                                     <h3 className={`font-semibold mb-1 ${selectedPaymentMethod ? 'text-gray-900' : 'text-gray-400'}`}>Payment Method</h3>
//                                     {selectedPaymentMethod ? (
//                                         <p className="text-sm text-gray-600">
//                                             {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
//                                         </p>
//                                     ) : (
//                                         <p className="text-sm text-gray-500">No method selected</p>
//                                     )}
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={() => setShowPaymentModal(true)}
//                                 disabled={!selectedSlot}
//                                 className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
//                             >
//                                 {selectedPaymentMethod ? 'Change payment method' : 'Select payment method'}
//                             </button>
//                             {!selectedSlot && (
//                                 <p className="text-xs text-gray-500 mt-2 text-center">Please select slot first</p>
//                             )}
//                         </div>
//                     </div>

//                     <div className="relative lg:max-w-xl">
//                         <div ref={scrollContainerRef} className="overflow-y-auto pb-28" style={{ maxHeight: 'calc(100vh - 180px)' }}>
//                             <div className="space-y-6 pr-4">
//                                 <div className="bg-white rounded-lg border border-gray-200 p-6">
//                                     <div className="flex gap-4 mb-4">
//                                         {checkoutItem.service.images && checkoutItem.service.images[0] && (
//                                             <img
//                                                 src={`${checkoutItem.service.images[0]}`}
//                                                 alt={checkoutItem.service.name}
//                                                 className="w-20 h-20 rounded-lg object-cover"
//                                             />
//                                         )}
//                                         <div className="flex-1">
//                                             <h3 className="font-semibold text-gray-900 mb-1">{checkoutItem.service.name}</h3>
//                                             <p className="text-sm text-gray-600 line-clamp-2">{checkoutItem.service.description}</p>
//                                         </div>
//                                     </div>

//                                     <div className="flex items-center justify-between">
//                                         <div className="flex items-center border border-gray-300 rounded-md">
//                                             <button
//                                                 onClick={() => handleUpdateQuantity(checkoutItem.quantity - 1)}
//                                                 disabled={loading}
//                                                 className="px-3 py-1 text-purple-600 hover:bg-gray-100 disabled:opacity-50"
//                                             >
//                                                 −
//                                             </button>
//                                             <span className="px-4 py-1 border-x border-gray-300 text-sm">{checkoutItem.quantity}</span>
//                                             <button
//                                                 onClick={() => handleUpdateQuantity(checkoutItem.quantity + 1)}
//                                                 disabled={loading}
//                                                 className="px-3 py-1 text-purple-600 hover:bg-gray-100 disabled:opacity-50"
//                                             >
//                                                 +
//                                             </button>
//                                         </div>
//                                         <div className="text-right">
//                                             <p className="text-sm font-semibold text-gray-900">₹{formatPrice(itemPrice)}</p>
//                                             {checkoutItem.discountPrice && (
//                                                 <p className="text-xs text-gray-500 line-through">₹{formatPrice(checkoutItem.price)}</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="bg-white rounded-lg border border-gray-200 p-6">
//                                     <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
//                                     <div className="space-y-3">
//                                         <div className="flex justify-between text-sm">
//                                             <span className="text-gray-700">Item total ({checkoutItem.quantity} × ₹{formatPrice(itemPrice)})</span>
//                                             <span className="font-semibold">₹{formatPrice(subtotal)}</span>
//                                         </div>
//                                         <div className="flex justify-between text-sm">
//                                             <span className="text-gray-700">Taxes & Fee (18%)</span>
//                                             <span className="font-semibold">₹{formatPrice(tax)}</span>
//                                         </div>
//                                         <div className="flex justify-between pt-3 border-t border-gray-200">
//                                             <span className="font-semibold">Amount to pay</span>
//                                             <span className="text-xl font-bold">₹{formatPrice(totalAmount)}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="fixed bottom-0 lg:max-w-xl w-full bg-white border-t-2 border-gray-200 p-4 shadow-lg z-50">
//                             <div className="flex items-center justify-between pr-4">
//                                 <div>
//                                     <p className="text-sm text-gray-600">Amount to pay</p>
//                                     <p className="text-2xl font-bold">₹{formatPrice(totalAmount)}</p>
//                                 </div>
//                                 <button
//                                     onClick={handlePlaceOrder}
//                                     disabled={!selectedAddress || !selectedSlot || !selectedPaymentMethod || processingCheckout}
//                                     className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
//                                 >
//                                     {processingCheckout ? (
//                                         <>
//                                             <Loader2 className="w-5 h-5 animate-spin" />
//                                             Processing...
//                                         </>
//                                     ) : (
//                                         'Place Order'
//                                     )}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Address Modal */}
//             {showAddressModal && (
//                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//                     <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
//                         <div className="flex items-center justify-between mb-6">
//                             <h2 className="text-xl font-bold">Select Address</h2>
//                             <button onClick={() => setShowAddressModal(false)}>
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>

//                         <button
//                             onClick={handleUseCurrentLocation}
//                             disabled={gettingLocation}
//                             className="w-full flex items-center justify-center gap-3 p-4 text-purple-600 hover:bg-purple-50 rounded-lg transition disabled:opacity-50 mb-6 border border-purple-200"
//                         >
//                             {gettingLocation ? (
//                                 <>
//                                     <Loader2 className="w-5 h-5 animate-spin" />
//                                     <span className="font-semibold">Getting location...</span>
//                                 </>
//                             ) : (
//                                 <>
//                                     <MapPin className="w-5 h-5" />
//                                     <span className="font-semibold">Use current location</span>
//                                 </>
//                             )}
//                         </button>

//                         {addresses.length > 0 && (
//                             <div className="space-y-3">
//                                 <h3 className="font-semibold text-gray-900">Saved Addresses</h3>
//                                 {addresses.map((addr) => (
//                                     <button
//                                         key={addr._id}
//                                         onClick={() => {
//                                             setSelectedAddress(addr);
//                                             setShowAddressModal(false);
//                                         }}
//                                         className={`w-full text-left p-4 border-2 rounded-lg transition ${selectedAddress?._id === addr._id
//                                             ? 'border-purple-600 bg-purple-50'
//                                             : 'border-gray-200 hover:border-gray-300'
//                                             }`}
//                                     >
//                                         <p className="font-medium text-gray-900 capitalize">{addr.type}</p>
//                                         <p className="text-sm text-gray-600 mt-1">
//                                             {addr.houseNo}, {addr.street}, {addr.city}
//                                         </p>
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Map Modal */}
//             {showMapModal && mapCenter && (
//                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//                     <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex overflow-hidden">
//                         <button
//                             onClick={() => setShowMapModal(false)}
//                             className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 z-10"
//                         >
//                             <X className="w-5 h-5" />
//                         </button>

//                         <div className="flex-1 relative bg-gray-100">
//                             <iframe
//                                 width="100%"
//                                 height="100%"
//                                 style={{ border: 0 }}
//                                 src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 0.01},${mapCenter.lat - 0.01},${mapCenter.lng + 0.01},${mapCenter.lat + 0.01}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`}
//                                 title="Location Map"
//                             />
//                         </div>

//                         <div className="w-96 bg-white flex flex-col">
//                             <div className="p-6 border-b">
//                                 <h3 className="font-semibold text-gray-900">
//                                     {mapAddress.split(',')[0] || 'Current Location'}
//                                 </h3>
//                             </div>

//                             <div className="flex-1 overflow-y-auto p-6">
//                                 <form onSubmit={handleCreateAddress} className="space-y-4">
//                                     <input
//                                         type="text"
//                                         value={newAddress.houseNo}
//                                         onChange={(e) => setNewAddress(prev => ({ ...prev, houseNo: e.target.value }))}
//                                         placeholder="House/Flat Number*"
//                                         className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
//                                     />
//                                     <input
//                                         type="text"
//                                         value={newAddress.street}
//                                         onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
//                                         placeholder="Street/Area"
//                                         className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
//                                     />
//                                     <input
//                                         type="text"
//                                         value={newAddress.landmark}
//                                         onChange={(e) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
//                                         placeholder="Landmark (Optional)"
//                                         className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
//                                     />
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <input
//                                             type="text"
//                                             value={newAddress.city}
//                                             onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
//                                             placeholder="City*"
//                                             className="px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
//                                         />
//                                         <input
//                                             type="text"
//                                             value={newAddress.state}
//                                             onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
//                                             placeholder="State*"
//                                             className="px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
//                                         />
//                                     </div>
//                                     <input
//                                         type="text"
//                                         value={newAddress.pincode}
//                                         onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
//                                         placeholder="Pincode"
//                                         maxLength={6}
//                                         className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
//                                     />
//                                     <input
//                                         type="text"
//                                         value={newAddress.name}
//                                         onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
//                                         placeholder="Name*"
//                                         className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
//                                     />
//                                     <input
//                                         type="tel"
//                                         value={newAddress.phone}
//                                         onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
//                                         placeholder="Phone Number*"
//                                         maxLength={10}
//                                         className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
//                                     />
//                                     <div className="flex gap-3">
//                                         {['home', 'work', 'other'].map((type) => (
//                                             <button
//                                                 key={type}
//                                                 type="button"
//                                                 onClick={() => setNewAddress(prev => ({ ...prev, type }))}
//                                                 className={`flex-1 py-2 rounded-lg border-2 font-medium capitalize ${newAddress.type === type
//                                                     ? 'border-purple-600 bg-purple-50 text-purple-600'
//                                                     : 'border-gray-300 text-gray-700'
//                                                     }`}
//                                             >
//                                                 {type}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </form>
//                             </div>

//                             <div className="p-6 border-t">
//                                 <button
//                                     onClick={handleCreateAddress}
//                                     disabled={loading || !newAddress.name || !newAddress.phone || !newAddress.houseNo}
//                                     className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <Loader2 className="w-5 h-5 animate-spin" />
//                                             Saving...
//                                         </>
//                                     ) : (
//                                         'Save address'
//                                     )}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Slot Modal */}
//             {showSlotModal && (
//                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//                     <div className="bg-white rounded-2xl max-w-md w-full p-6">
//                         <div className="flex items-center justify-between mb-6">
//                             <h2 className="text-xl font-bold">Select Time Slot</h2>
//                             <button onClick={() => setShowSlotModal(false)}>
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>

//                         <div className="space-y-3">
//                             {timeSlots.map((slot) => (
//                                 <button
//                                     key={slot.id}
//                                     onClick={() => {
//                                         if (slot.available) {
//                                             setSelectedSlot(slot);
//                                             setShowSlotModal(false);
//                                         }
//                                     }}
//                                     disabled={!slot.available}
//                                     className={`w-full p-4 border-2 rounded-lg text-left transition ${selectedSlot?.id === slot.id
//                                         ? 'border-purple-600 bg-purple-50'
//                                         : slot.available
//                                             ? 'border-gray-200 hover:border-gray-300'
//                                             : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
//                                         }`}
//                                 >
//                                     <div className="flex justify-between items-center">
//                                         <div>
//                                             <p className="font-semibold text-gray-900">{slot.date}</p>
//                                             <p className="text-sm text-gray-600">{slot.time}</p>
//                                         </div>
//                                         {!slot.available && (
//                                             <span className="text-xs text-red-600 font-medium">Not Available</span>
//                                         )}
//                                         {selectedSlot?.id === slot.id && (
//                                             <Check className="w-5 h-5 text-purple-600" />
//                                         )}
//                                     </div>
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Payment Modal */}
//             {showPaymentModal && (
//                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//                     <div className="bg-white rounded-2xl max-w-md w-full p-6">
//                         <div className="flex items-center justify-between mb-6">
//                             <h2 className="text-xl font-bold">Select Payment Method</h2>
//                             <button onClick={() => setShowPaymentModal(false)}>
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>

//                         <div className="space-y-3">
//                             {paymentMethods.map((method) => (
//                                 <button
//                                     key={method.id}
//                                     onClick={() => {
//                                         setSelectedPaymentMethod(method.id);
//                                         setShowPaymentModal(false);
//                                     }}
//                                     className={`w-full p-4 border-2 rounded-lg text-left transition ${selectedPaymentMethod === method.id
//                                         ? 'border-purple-600 bg-purple-50'
//                                         : 'border-gray-200 hover:border-gray-300'
//                                         }`}
//                                 >
//                                     <div className="flex items-center justify-between">
//                                         <div className="flex items-center gap-3">
//                                             <CreditCard className="w-5 h-5 text-gray-600" />
//                                             <span className="font-semibold text-gray-900">{method.name}</span>
//                                         </div>
//                                         {selectedPaymentMethod === method.id && (
//                                             <Check className="w-5 h-5 text-purple-600" />
//                                         )}
//                                     </div>
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }






            import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, X, MapPin, Phone, Clock, CreditCard, AlertCircle, Check, Loader2, ShoppingCart } from 'lucide-react';
import {
    getAddresses,
    createAddress,
    createBooking,
    createRazorpayOrder,
    verifyPayment,
    cashPayment,
    getMyProfile,
    removeFromCart,  //  Added
    clearCart        //  Added
} from '../page/Api';

export default function Checkout() {
    // Single Item State
    const [checkoutItem, setCheckoutItem] = useState(null);

    // Modals
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);

    // Data
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [mapAddress, setMapAddress] = useState('');
    const [userProfile, setUserProfile] = useState(null);

    // Loading & Messages
    const [loading, setLoading] = useState(false);
    const [processingCheckout, setProcessingCheckout] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

    // New Address Form
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

    const timeSlots = [
        { id: 1, date: "2025-01-09", displayDate: "Today, Jan 09", time: "09:00 AM - 12:00 PM", available: true },
        { id: 2, date: "2025-01-09", displayDate: "Today, Jan 09", time: "12:00 PM - 03:00 PM", available: true },
        { id: 3, date: "2025-01-09", displayDate: "Today, Jan 09", time: "03:00 PM - 06:00 PM", available: false },
        { id: 4, date: "2025-01-10", displayDate: "Tomorrow, Jan 10", time: "09:00 AM - 12:00 PM", available: true },
        { id: 5, date: "2025-01-10", displayDate: "Tomorrow, Jan 10", time: "12:00 PM - 03:00 PM", available: true }
    ];

    const paymentMethods = [
        { id: 'card', name: 'Credit/Debit Card', description: 'Instant payment', icon: 'card' },
        { id: 'upi', name: 'UPI', description: 'Instant payment', icon: 'upi' },
        { id: 'cash', name: 'Cash on Service', description: 'Pay after service', icon: 'cash' }
    ];

    //  Decimal Calculation Helper Functions
    const roundToTwo = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const formatPrice = (num) => {
        return Number(num).toFixed(2);
    };

    // Load checkout item from sessionStorage
    const loadCheckoutItem = () => {
        const stored = sessionStorage.getItem('checkoutItem');
        if (stored) {
            const item = JSON.parse(stored);
            setCheckoutItem(item);
            console.log('🛒 Checkout item loaded:', item);
        } else {
            setError('No item selected for checkout');
        }
    };

    // Fetch user profile
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

    // Fetch Addresses
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

    // Update quantity
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

    // Get current location
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
                headers: { 'User-Agent': 'Urban Company Checkout App' }
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

    // Create new address
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

    // Load Razorpay Script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    //  NEW FUNCTION: Clear cart after successful booking
    const clearCartAfterBooking = async () => {
        try {
            console.log('🗑️ Clearing cart after booking...');
            
            // Get checkout item
            const item = sessionStorage.getItem('checkoutItem');
            
            if (item) {
                const parsedItem = JSON.parse(item);
                
                // If there's a service ID, remove that specific item
                if (parsedItem.service?._id) {
                    console.log('Removing service from cart:', parsedItem.service._id);
                    await removeFromCart(parsedItem.service._id);
                } else {
                    // Otherwise clear entire cart
                    console.log('Clearing entire cart');
                    await clearCart();
                }
                
                // Clear session storage
                sessionStorage.removeItem('checkoutItem');
                
                // Fire event to notify cart page
                window.dispatchEvent(new Event('cartUpdated'));
                
                console.log(' Cart cleared successfully');
            }
            
        } catch (error) {
            console.error('⚠️ Failed to clear cart (booking is still successful):', error);
            // Don't throw error - booking is already done
        }
    };

    // Handle Payment - UPDATED with cart clearing
    const handlePayment = async (bookingId) => {
        try {
            if (selectedPaymentMethod === 'cash') {
                const response = await cashPayment(bookingId);
                if (response.success) {
                    
                    //  Cart clear karo after successful booking
                    await clearCartAfterBooking();
                    
                    setSuccess('🎉 Order placed successfully with Cash on Service!');
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
                            
                            //  Cart clear karo after successful payment
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

    // Place Order
    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            setError('⚠️ Please select a delivery address');
            return;
        }
        if (!selectedSlot) {
            setError('⚠️ Please select a time slot');
            return;
        }
        if (!selectedPaymentMethod) {
            setError('⚠️ Please select a payment method');
            return;
        }
        if (!checkoutItem) {
            setError('⚠️ No item selected');
            return;
        }

        try {
            setProcessingCheckout(true);
            setError(null);

            const bookingData = {
                service: checkoutItem.service._id,
                address: selectedAddress._id,
                scheduledDate: selectedSlot.date,
                scheduledTime: selectedSlot.time,
                notes: `Service: ${checkoutItem.service.name}, Quantity: ${checkoutItem.quantity}`
            };

            console.log('Creating booking with data:', bookingData);

            const bookingResponse = await createBooking(bookingData);

            if (!bookingResponse.success) {
                throw new Error('Failed to create booking');
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

    //  Decimal Calculations
    const itemPrice = checkoutItem ? roundToTwo(Number(checkoutItem.discountPrice || checkoutItem.price) || 0) : 0;
    const subtotal = checkoutItem ? roundToTwo(itemPrice * (checkoutItem.quantity || 1)) : 0;
    const tax = roundToTwo(subtotal * 0.18);
    const totalAmount = roundToTwo(subtotal + tax);

    useEffect(() => {
        const init = async () => {
            setFetchingData(true);
            loadCheckoutItem();
            await fetchUserProfile();
            await fetchAddresses();
            setFetchingData(false);
        };
        init();
    }, []);

    if (fetchingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
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
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Delivery Address</h3>
                                    {selectedAddress ? (
                                        <div className="text-sm text-gray-600 mt-2">
                                            <p className="font-medium text-gray-900 capitalize">{selectedAddress.type}</p>
                                            <p>{selectedAddress.houseNo}, {selectedAddress.street}</p>
                                            <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 mt-2">No address selected</p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAddressModal(true)}
                                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                            >
                                {selectedAddress ? 'Change address' : 'Select address'}
                            </button>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <Clock className={`w-5 h-5 mt-0.5 ${selectedSlot ? 'text-gray-600' : 'text-gray-400'}`} />
                                <div className="flex-1">
                                    <h3 className={`font-semibold mb-1 ${selectedSlot ? 'text-gray-900' : 'text-gray-400'}`}>Time Slot</h3>
                                    {selectedSlot ? (
                                        <p className="text-sm text-gray-600">{selectedSlot.displayDate} • {selectedSlot.time}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500">No slot selected</p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowSlotModal(true)}
                                disabled={!selectedAddress}
                                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {selectedSlot ? 'Change slot' : 'Select slot'}
                            </button>
                            {!selectedAddress && (
                                <p className="text-xs text-gray-500 mt-2 text-center">Please select address first</p>
                            )}
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <CreditCard className={`w-5 h-5 mt-0.5 ${selectedPaymentMethod ? 'text-gray-600' : 'text-gray-400'}`} />
                                <div className="flex-1">
                                    <h3 className={`font-semibold mb-1 ${selectedPaymentMethod ? 'text-gray-900' : 'text-gray-400'}`}>Payment Method</h3>
                                    {selectedPaymentMethod ? (
                                        <p className="text-sm text-gray-600">
                                            {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-500">No method selected</p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPaymentModal(true)}
                                disabled={!selectedSlot}
                                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {selectedPaymentMethod ? 'Change payment method' : 'Select payment method'}
                            </button>
                            {!selectedSlot && (
                                <p className="text-xs text-gray-500 mt-2 text-center">Please select slot first</p>
                            )}
                        </div>
                    </div>

                    <div className="relative lg:max-w-xl">
                        <div ref={scrollContainerRef} className="overflow-y-auto pb-28" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                            <div className="space-y-6 pr-4">
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <div className="flex gap-4 mb-4">
                                        {checkoutItem.service.images && checkoutItem.service.images[0] && (
                                            <img
                                                src={`${checkoutItem.service.images[0]}`}
                                                alt={checkoutItem.service.name}
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{checkoutItem.service.name}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">{checkoutItem.service.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border border-gray-300 rounded-md">
                                            <button
                                                onClick={() => handleUpdateQuantity(checkoutItem.quantity - 1)}
                                                disabled={loading}
                                                className="px-3 py-1 text-purple-600 hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                −
                                            </button>
                                            <span className="px-4 py-1 border-x border-gray-300 text-sm">{checkoutItem.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(checkoutItem.quantity + 1)}
                                                disabled={loading}
                                                className="px-3 py-1 text-purple-600 hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">₹{formatPrice(itemPrice)}</p>
                                            {checkoutItem.discountPrice && (
                                                <p className="text-xs text-gray-500 line-through">₹{formatPrice(checkoutItem.price)}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-700">Item total ({checkoutItem.quantity} × ₹{formatPrice(itemPrice)})</span>
                                            <span className="font-semibold">₹{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-700">Taxes & Fee (18%)</span>
                                            <span className="font-semibold">₹{formatPrice(tax)}</span>
                                        </div>
                                        <div className="flex justify-between pt-3 border-t border-gray-200">
                                            <span className="font-semibold">Amount to pay</span>
                                            <span className="text-xl font-bold">₹{formatPrice(totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="fixed bottom-0 lg:max-w-xl w-full bg-white border-t-2 border-gray-200 p-4 shadow-lg z-50">
                            <div className="flex items-center justify-between pr-4">
                                <div>
                                    <p className="text-sm text-gray-600">Amount to pay</p>
                                    <p className="text-2xl font-bold">₹{formatPrice(totalAmount)}</p>
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

            {/* MODALS CONTINUE IN NEXT PART... */}
                      {showAddressModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Select Address</h2>
                            <button onClick={() => setShowAddressModal(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <button
                            onClick={handleUseCurrentLocation}
                            disabled={gettingLocation}
                            className="w-full flex items-center justify-center gap-3 p-4 text-purple-600 hover:bg-purple-50 rounded-lg transition disabled:opacity-50 mb-6 border border-purple-200"
                        >
                            {gettingLocation ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="font-semibold">Getting location...</span>
                                </>
                            ) : (
                                <>
                                    <MapPin className="w-5 h-5" />
                                    <span className="font-semibold">Use current location</span>
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
                                        className={`w-full text-left p-4 border-2 rounded-lg transition ${selectedAddress?._id === addr._id
                                            ? 'border-purple-600 bg-purple-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <p className="font-medium text-gray-900 capitalize">{addr.type}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {addr.houseNo}, {addr.street}, {addr.city}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Map Modal */}
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
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <form onSubmit={handleCreateAddress} className="space-y-4">
                                    <input
                                        type="text"
                                        value={newAddress.houseNo}
                                        onChange={(e) => setNewAddress(prev => ({ ...prev, houseNo: e.target.value }))}
                                        placeholder="House/Flat Number*"
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                    />
                                    <input
                                        type="text"
                                        value={newAddress.street}
                                        onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                                        placeholder="Street/Area"
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                    />
                                    <input
                                        type="text"
                                        value={newAddress.landmark}
                                        onChange={(e) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
                                        placeholder="Landmark (Optional)"
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                                            placeholder="City*"
                                            className="px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                        />
                                        <input
                                            type="text"
                                            value={newAddress.state}
                                            onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                                            placeholder="State*"
                                            className="px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={newAddress.pincode}
                                        onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                                        placeholder="Pincode"
                                        maxLength={6}
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                    />
                                    <input
                                        type="text"
                                        value={newAddress.name}
                                        onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Name*"
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                    />
                                    <input
                                        type="tel"
                                        value={newAddress.phone}
                                        onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                                        placeholder="Phone Number*"
                                        maxLength={10}
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
                                    />
                                    <div className="flex gap-3">
                                        {['home', 'work', 'other'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setNewAddress(prev => ({ ...prev, type }))}
                                                className={`flex-1 py-2 rounded-lg border-2 font-medium capitalize ${newAddress.type === type
                                                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                                                    : 'border-gray-300 text-gray-700'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t">
                                <button
                                    onClick={handleCreateAddress}
                                    disabled={loading || !newAddress.name || !newAddress.phone || !newAddress.houseNo}
                                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save address'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Slot Modal */}
            {showSlotModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Select Time Slot</h2>
                            <button onClick={() => setShowSlotModal(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {timeSlots.map((slot) => (
                                <button
                                    key={slot.id}
                                    onClick={() => {
                                        if (slot.available) {
                                            setSelectedSlot(slot);
                                            setShowSlotModal(false);
                                        }
                                    }}
                                    disabled={!slot.available}
                                    className={`w-full p-4 border-2 rounded-lg text-left transition ${selectedSlot?.id === slot.id
                                        ? 'border-purple-600 bg-purple-50'
                                        : slot.available
                                            ? 'border-gray-200 hover:border-gray-300'
                                            : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-900">{slot.date}</p>
                                            <p className="text-sm text-gray-600">{slot.time}</p>
                                        </div>
                                        {!slot.available && (
                                            <span className="text-xs text-red-600 font-medium">Not Available</span>
                                        )}
                                        {selectedSlot?.id === slot.id && (
                                            <Check className="w-5 h-5 text-purple-600" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
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
                                    className={`w-full p-4 border-2 rounded-lg text-left transition ${selectedPaymentMethod === method.id
                                        ? 'border-purple-600 bg-purple-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-5 h-5 text-gray-600" />
                                            <span className="font-semibold text-gray-900">{method.name}</span>
                                        </div>
                                        {selectedPaymentMethod === method.id && (
                                            <Check className="w-5 h-5 text-purple-600" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}





        </div>
    );
}

