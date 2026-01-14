import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    MapPin, 
    Clock, 
    CreditCard, 
    CheckCircle, 
    Package, 
    Loader2, 
    Calendar, 
    XCircle,
    AlertTriangle,
    X,
    RefreshCw
} from 'lucide-react';
import { getBookingById, getMyBookings, cancelBooking } from '../page/Api';

export default function MyBookingsPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellingBooking, setCancellingBooking] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);
    const [cancelSuccess, setCancelSuccess] = useState(null);
    const [cancelError, setCancelError] = useState(null);

    const cancelReasons = [
        'Change of plans',
        'Found a better price elsewhere',
        'Booked by mistake',
        'Service no longer needed',
        'Scheduling conflict',
        'Other'
    ];

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

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetails();
        } else {
            fetchAllBookings();
        }
    }, [bookingId, currentPage]);

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            const response = await getBookingById(bookingId);
            if (response.success) {
                setBooking(response.data);
            } else {
                setError('Failed to load booking details');
            }
        } catch (err) {
            setError(err.message || 'Failed to load booking');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllBookings = async () => {
        try {
            setLoading(true);
            const response = await getMyBookings({ page: currentPage, limit: 10 });
            if (response.success) {
                setBookings(response.data.bookings || []);
                setTotalPages(response.data.totalPages || 1);
            } else {
                setError('Failed to load bookings');
            }
        } catch (err) {
            setError(err.message || 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!selectedBookingToCancel) return;

        try {
            setCancellingBooking(true);
            setCancelError(null);

            const response = await cancelBooking(
                selectedBookingToCancel._id, 
                cancelReason || 'Cancelled by user'
            );

            if (response.success) {
                setCancelSuccess(response.message || 'Booking cancelled successfully');
                
                if (response.data?.refund) {
                    setCancelSuccess(`Booking cancelled! Refund of ₹${response.data.refund.amount} initiated.`);
                }

                if (bookingId) {
                    setBooking(prev => ({
                        ...prev,
                        status: 'cancelled',
                        cancellationReason: cancelReason,
                        paymentStatus: response.data?.booking?.paymentStatus || prev.paymentStatus
                    }));
                } else {
                    setBookings(prev => prev.map(b => 
                        b._id === selectedBookingToCancel._id 
                            ? { ...b, status: 'cancelled', cancellationReason: cancelReason }
                            : b
                    ));
                }

                setTimeout(() => {
                    setShowCancelModal(false);
                    setCancelSuccess(null);
                    setCancelReason('');
                    setSelectedBookingToCancel(null);
                }, 2000);

            } else {
                setCancelError(response.message || 'Failed to cancel booking');
            }
        } catch (err) {
            console.error('Cancel error:', err);
            setCancelError(err.message || 'Failed to cancel booking. Please try again.');
        } finally {
            setCancellingBooking(false);
        }
    };

    const openCancelModal = (bookingData, e) => {
        if (e) e.stopPropagation();
        setSelectedBookingToCancel(bookingData);
        setCancelReason('');
        setCancelError(null);
        setCancelSuccess(null);
        setShowCancelModal(true);
    };

    const canCancelBooking = (bookingData) => {
        const nonCancellableStatuses = ['completed', 'cancelled', 'in_progress'];
        return !nonCancellableStatuses.includes(bookingData?.status);
    };

    const getPaymentStatus = (bookingData) => {
        return bookingData?.paymentStatus || bookingData?.payment?.status || 'pending';
    };

    const getPaymentMethod = (bookingData) => {
        return bookingData?.paymentMethod || bookingData?.payment?.method || null;
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-50 text-amber-700 border-amber-200',
            confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
            in_progress: 'bg-purple-50 text-purple-700 border-purple-200',
            completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            cancelled: 'bg-red-50 text-red-700 border-red-200'
        };
        return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: 'text-amber-600',
            completed: 'text-emerald-600',
            failed: 'text-red-600',
            refunded: 'text-blue-600',
            cancelled: 'text-gray-600'
        };
        return colors[status] || 'text-gray-600';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-3.5 h-3.5" />;
            case 'confirmed':
                return <CheckCircle className="w-3.5 h-3.5" />;
            case 'in_progress':
                return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
            case 'completed':
                return <CheckCircle className="w-3.5 h-3.5" />;
            case 'cancelled':
                return <XCircle className="w-3.5 h-3.5" />;
            default:
                return <Clock className="w-3.5 h-3.5" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatShortDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (bookingId && booking) {
        const paymentStatus = getPaymentStatus(booking);
        const paymentMethod = getPaymentMethod(booking);

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate('/booking')} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <h1 className="text-base font-semibold text-gray-900">Booking Details</h1>
                        </div>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                  
                    {booking.status === 'confirmed' && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 text-center mb-4 shadow-sm">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                <CheckCircle className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 mb-1">Booking Confirmed</h2>
                            <p className="text-sm text-gray-600">Your service has been booked successfully</p>
                            <p className="text-xs text-gray-500 mt-1.5">ID: #{booking._id.slice(-8).toUpperCase()}</p>
                        </div>
                    )}

                    {booking.status === 'pending' && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 text-center mb-4 shadow-sm">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                <Clock className="w-7 h-7 text-amber-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 mb-1">Booking Pending</h2>
                            <p className="text-sm text-gray-600">Your booking is being processed</p>
                            <p className="text-xs text-gray-500 mt-1.5">ID: #{booking._id.slice(-8).toUpperCase()}</p>
                        </div>
                    )}

                    {booking.status === 'in_progress' && (
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 text-center mb-4 shadow-sm">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                <Loader2 className="w-7 h-7 text-purple-600 animate-spin" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 mb-1">Service In Progress</h2>
                            <p className="text-sm text-gray-600">Our professional is working on your service</p>
                            <p className="text-xs text-gray-500 mt-1.5">ID: #{booking._id.slice(-8).toUpperCase()}</p>
                        </div>
                    )}

                    {booking.status === 'completed' && (
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6 text-center mb-4 shadow-sm">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                <CheckCircle className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 mb-1">Service Completed</h2>
                            <p className="text-sm text-gray-600">Thank you for using our service!</p>
                            <p className="text-xs text-gray-500 mt-1.5">ID: #{booking._id.slice(-8).toUpperCase()}</p>
                        </div>
                    )}

                    {booking.status === 'cancelled' && (
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 text-center mb-4 shadow-sm">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                <XCircle className="w-7 h-7 text-red-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 mb-1">Booking Cancelled</h2>
                            <p className="text-sm text-gray-600">{booking.cancellationReason || 'This booking has been cancelled'}</p>
                            <p className="text-xs text-gray-500 mt-1.5">ID: #{booking._id.slice(-8).toUpperCase()}</p>
                            {paymentStatus === 'refunded' && (
                                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Refund Initiated
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3">
                                {booking.service?.images?.[0] ? (
                                    <img
                                        src={booking.service.images[0]}
                                        alt={booking.service.name}
                                        className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Package className="w-6 h-6 text-purple-600" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xs font-medium text-gray-500 mb-0.5">Service</h3>
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {booking.service?.name || 'Service'}
                                    </p>
                                    {booking.service?.description && (
                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{booking.service.description}</p>
                                    )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xl font-bold text-purple-600">₹{booking.totalAmount?.toFixed(2)}</p>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1.5 border ${getStatusColor(booking.status)}`}>
                                        {getStatusIcon(booking.status)}
                                        <span className="capitalize">{booking.status?.replace('_', ' ')}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          
                            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">Scheduled Time</h3>
                                        <p className="text-sm font-medium text-gray-900">{formatDate(booking.scheduledDate)}</p>
                                        <p className="text-xs text-gray-600 mt-0.5">{booking.scheduledTime}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">Service Address</h3>
                                        {booking.address ? (
                                            <>
                                                <p className="text-sm font-medium text-gray-900 capitalize">{booking.address.type}</p>
                                                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                                    {booking.address.houseNo}, {booking.address.street}
                                                    {booking.address.landmark && `, Near ${booking.address.landmark}`}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {booking.address.city}, {booking.address.state} {booking.address.pincode}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-xs text-gray-500">Address not available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CreditCard className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xs font-medium text-gray-500 mb-2">Payment Information</h3>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-600">Payment Status</span>
                                            <span className={`text-xs font-semibold capitalize ${getPaymentStatusColor(paymentStatus)}`}>
                                                {paymentStatus === 'completed' && '✓ '}
                                                {paymentStatus === 'refunded' && '↩ '}
                                                {paymentStatus}
                                            </span>
                                        </div>

                                        {paymentMethod && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600">Payment Method</span>
                                                <span className="text-xs font-medium text-gray-700 capitalize">
                                                    {paymentMethod === 'cash' ? 'Cash on Service' : paymentMethod}
                                                </span>
                                            </div>
                                        )}

                                        <div className="border-t pt-2 mt-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-600">Service Price</span>
                                                <span className="text-gray-700">₹{booking.price?.toFixed(2)}</span>
                                            </div>
                                            {booking.tax > 0 && (
                                                <div className="flex justify-between items-center text-xs mt-1">
                                                    <span className="text-gray-600">Tax (18%)</span>
                                                    <span className="text-gray-700">₹{booking.tax?.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center mt-2 pt-2 border-t">
                                                <span className="text-sm font-semibold text-gray-900">Total Amount</span>
                                                <span className="text-base font-bold text-gray-900">₹{booking.totalAmount?.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {paymentStatus === 'refunded' && booking.payment?.refundAmount && (
                                            <div className="flex justify-between items-center text-xs pt-2 border-t bg-blue-50 -mx-2 px-2 py-2 rounded">
                                                <span className="text-blue-700 font-medium">Refund Amount</span>
                                                <span className="font-semibold text-blue-700">₹{booking.payment.refundAmount?.toFixed(2)}</span>
                                            </div>
                                        )}

                                        {booking.payment?.transactionId && (
                                            <div className="flex justify-between items-center text-xs pt-2 border-t">
                                                <span className="text-gray-600">Transaction ID</span>
                                                <span className="font-mono text-xs text-gray-500">
                                                    {booking.payment.transactionId.slice(-12)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {booking.notes && (
                            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                <h3 className="text-xs font-medium text-gray-500 mb-1">Notes</h3>
                                <p className="text-sm text-gray-700">{booking.notes}</p>
                            </div>
                        )}

                        {booking.status === 'cancelled' && booking.cancellationReason && (
                            <div className="bg-red-50 rounded-lg border border-red-200 p-4 shadow-sm">
                                <h3 className="text-xs font-medium text-red-600 mb-1">Cancellation Reason</h3>
                                <p className="text-sm text-red-700">{booking.cancellationReason}</p>
                                {booking.cancelledAt && (
                                    <p className="text-xs text-red-500 mt-2">
                                        Cancelled on: {formatDate(booking.cancelledAt)}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm"
                            >
                                Book More Services
                            </button>
                            
                            {canCancelBooking(booking) ? (
                                <button
                                    onClick={() => openCancelModal(booking)}
                                    className="flex-1 bg-white border-2 border-red-500 text-red-500 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors shadow-sm"
                                >
                                    Cancel Booking
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/booking')}
                                    className="flex-1 bg-white border border-purple-600 text-purple-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors shadow-sm"
                                >
                                    View All Bookings
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {showCancelModal && (
                    <CancelModal
                        booking={selectedBookingToCancel}
                        cancelReason={cancelReason}
                        setCancelReason={setCancelReason}
                        cancelReasons={cancelReasons}
                        cancellingBooking={cancellingBooking}
                        cancelSuccess={cancelSuccess}
                        cancelError={cancelError}
                        onClose={() => {
                            setShowCancelModal(false);
                            setCancelReason('');
                            setCancelError(null);
                            setCancelSuccess(null);
                        }}
                        onConfirm={handleCancelBooking}
                        getPaymentStatus={getPaymentStatus}
                    />
                )}
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate('/')} className="p-1.5 hover:bg-gray-100 rounded-lg">
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <h1 className="text-base font-semibold text-gray-900">My Bookings</h1>
                        </div>
                    </div>
                </header>
                <div className="max-w-md mx-auto px-4 py-16 text-center">
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <XCircle className="w-7 h-7 text-red-600" />
                    </div>
                    <p className="text-sm text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 shadow-sm"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate('/')} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <h1 className="text-base font-semibold text-gray-900">My Bookings</h1>
                        </div>
                        <button
                            onClick={() => navigate('/help')}
                            className="text-sm text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                        >
                            Help
                        </button>
                    </div>
                </div>
            </header>

            {bookings.length === 0 ? (
                <div className="max-w-md mx-auto px-4 py-20 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">No bookings yet</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Looks like you haven't experienced quality services at home.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors inline-flex items-center gap-2 shadow-sm"
                    >
                        Explore our services
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                </div>
            ) : (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                    <div className="space-y-3">
                        {bookings.map((bookingItem) => {
                            const itemPaymentStatus = getPaymentStatus(bookingItem);
                            
                            return (
                                <div
                                    key={bookingItem._id}
                                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
                                >
                                    <div 
                                        onClick={() => navigate(`/booking/${bookingItem._id}`)}
                                        className="cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                {bookingItem.service?.images?.[0] ? (
                                                    <img
                                                        src={bookingItem.service.images[0]}
                                                        alt={bookingItem.service.name}
                                                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Package className="w-7 h-7 text-purple-600" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 text-sm mb-0.5 truncate hover:text-purple-600 transition-colors">
                                                        {bookingItem.service?.name || 'Service'}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mb-2">
                                                        ID: #{bookingItem._id.slice(-8).toUpperCase()}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-xs text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span>{formatShortDate(bookingItem.scheduledDate)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span>{bookingItem.scheduledTime}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right ml-3 flex-shrink-0">
                                                <p className="text-lg font-bold text-purple-600 mb-1.5">
                                                    ₹{bookingItem.totalAmount?.toFixed(2)}
                                                </p>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(bookingItem.status)}`}>
                                                    {getStatusIcon(bookingItem.status)}
                                                    <span className="capitalize">{bookingItem.status?.replace('_', ' ')}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            {bookingItem.address && (
                                                <div className="flex items-start gap-1.5 text-xs text-gray-600 flex-1 min-w-0 mr-3">
                                                    <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                                    <p className="line-clamp-1">
                                                        {bookingItem.address.houseNo}, {bookingItem.address.street}, {bookingItem.address.city}
                                                    </p>
                                                </div>
                                            )}
                                            <span className={`text-xs font-medium ${getPaymentStatusColor(itemPaymentStatus)} flex-shrink-0`}>
                                                {itemPaymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {canCancelBooking(bookingItem) && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <button
                                                onClick={(e) => openCancelModal(bookingItem, e)}
                                                className="w-full py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                                            >
                                                Cancel Booking
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-xs text-gray-600 px-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            {showCancelModal && (
                <CancelModal
                    booking={selectedBookingToCancel}
                    cancelReason={cancelReason}
                    setCancelReason={setCancelReason}
                    cancelReasons={cancelReasons}
                    cancellingBooking={cancellingBooking}
                    cancelSuccess={cancelSuccess}
                    cancelError={cancelError}
                    onClose={() => {
                        setShowCancelModal(false);
                        setCancelReason('');
                        setCancelError(null);
                        setCancelSuccess(null);
                    }}
                    onConfirm={handleCancelBooking}
                    getPaymentStatus={getPaymentStatus}
                />
            )}
        </div>
    );
}

function CancelModal({ 
    booking, 
    cancelReason, 
    setCancelReason, 
    cancelReasons, 
    cancellingBooking, 
    cancelSuccess, 
    cancelError, 
    onClose, 
    onConfirm,
    getPaymentStatus 
}) {
    const [customReason, setCustomReason] = useState('');
    const paymentStatus = getPaymentStatus(booking);
    const isPaid = paymentStatus === 'completed';

    const handleReasonSelect = (reason) => {
        if (reason === 'Other') {
            setCancelReason('');
            setCustomReason('');
        } else {
            setCancelReason(reason);
            setCustomReason('');
        }
    };

    const handleCustomReasonChange = (e) => {
        const value = e.target.value;
        setCustomReason(value);
        setCancelReason(value || '');
    };

    const isOtherSelected = !cancelReasons.slice(0, -1).includes(cancelReason) && cancelReason !== '';

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Cancel Booking</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">

                    {cancelSuccess && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-green-800">{cancelSuccess}</p>
                            </div>
                        </div>
                    )}

                    {cancelError && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{cancelError}</p>
                        </div>
                    )}

                    {!cancelSuccess && (
                        <>
                          
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-3">
                                    {booking?.service?.images?.[0] ? (
                                        <img
                                            src={booking.service.images[0]}
                                            alt={booking.service.name}
                                            className="w-12 h-12 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Package className="w-6 h-6 text-purple-600" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">
                                            {booking?.service?.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            ₹{booking?.totalAmount?.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {isPaid && (
                                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <RefreshCw className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-blue-800">Refund will be initiated</p>
                                            <p className="text-xs text-blue-600 mt-1">
                                                Amount of ₹{booking?.totalAmount?.toFixed(2)} will be refunded to your original payment method within 5-7 business days.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Why are you cancelling?
                                </label>
                                <div className="space-y-2">
                                    {cancelReasons.map((reason) => (
                                        <button
                                            key={reason}
                                            onClick={() => handleReasonSelect(reason)}
                                            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                                                (reason !== 'Other' && cancelReason === reason) ||
                                                (reason === 'Other' && isOtherSelected)
                                                    ? 'border-red-500 bg-red-50 text-red-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                            }`}
                                        >
                                            <span className="text-sm">{reason}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {isOtherSelected && (
                                <div className="mb-4">
                                    <textarea
                                        placeholder="Please specify your reason..."
                                        value={customReason}
                                        onChange={handleCustomReasonChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm resize-none"
                                        rows={3}
                                    />
                                </div>
                            )}

                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                                <p className="text-xs text-amber-800">
                                     This action cannot be undone. Please confirm you want to cancel this booking.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {!cancelSuccess && (
                    <div className="flex gap-3 p-6 border-t bg-gray-50">
                        <button
                            onClick={onClose}
                            disabled={cancellingBooking}
                            className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                            Keep Booking
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={!cancelReason || cancellingBooking}
                            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {cancellingBooking ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Cancelling...
                                </>
                            ) : (
                                'Yes, Cancel Booking'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}