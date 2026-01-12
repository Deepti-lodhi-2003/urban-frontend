import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CreditCard, CheckCircle, Package, Loader2, Calendar, XCircle } from 'lucide-react';
import { getBookingById, getMyBookings } from '../page/Api';

export default function MyBookingsPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
            refunded: 'text-blue-600'
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

    // ==================== SINGLE BOOKING DETAILS VIEW ====================
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
                    {/* Success Banner */}
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

                    {booking.status === 'cancelled' && (
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 text-center mb-4 shadow-sm">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                <XCircle className="w-7 h-7 text-red-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 mb-1">Booking Cancelled</h2>
                            <p className="text-sm text-gray-600">{booking.cancellationReason || 'This booking has been cancelled'}</p>
                            <p className="text-xs text-gray-500 mt-1.5">ID: #{booking._id.slice(-8).toUpperCase()}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {/* Service Details */}
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

                        {/* Schedule & Address Grid */}
                        <div className="grid md:grid-cols-2 gap-3">
                            {/* Schedule */}
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

                            {/* Address */}
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

                        {/* Payment Info */}
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

                        {/* Notes */}
                        {booking.notes && (
                            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                <h3 className="text-xs font-medium text-gray-500 mb-1">Notes</h3>
                                <p className="text-sm text-gray-700">{booking.notes}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm"
                            >
                                Book More Services
                            </button>
                            <button
                                onClick={() => navigate('/booking')}
                                className="flex-1 bg-white border border-purple-600 text-purple-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors shadow-sm"
                            >
                                View All Bookings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==================== ERROR STATE ====================
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

    // ==================== ALL BOOKINGS LIST VIEW ====================
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
                                    onClick={() => navigate(`/booking/${bookingItem._id}`)}
                                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer group"
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
                                                <h3 className="font-semibold text-gray-900 text-sm mb-0.5 truncate group-hover:text-purple-600 transition-colors">
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
                            );
                        })}
                    </div>

                    {/* Pagination */}
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
        </div>
    );
}