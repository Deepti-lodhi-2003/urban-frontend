import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CreditCard, CheckCircle, Package, Loader2, Calendar } from 'lucide-react';
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
            console.error('Error fetching booking:', err);
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
            console.error('Error fetching bookings:', err);
            setError(err.message || 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
            in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
            completed: 'bg-green-100 text-green-700 border-green-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'confirmed':
                return <CheckCircle className="w-4 h-4" />;
            case 'in_progress':
                return <Loader2 className="w-4 h-4 animate-spin" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <span className="text-lg">✕</span>;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    // SINGLE BOOKING DETAILS VIEW
    if (bookingId && booking) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">Booking Details</h1>
                        </div>
                    </div>
                </header>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                        <p className="text-gray-600">Your service has been booked successfully</p>
                        <p className="text-sm text-gray-500 mt-2">Booking ID: #{booking._id.slice(-8)}</p>
                    </div>

                    <div className="space-y-4">
                        {/* Service Details */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Package className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Service Details</h3>
                                    <p className="text-lg font-medium text-gray-800">
                                        {booking.service?.name || 'Service'}
                                    </p>
                                    {booking.service?.description && (
                                        <p className="text-sm text-gray-600 mt-1">{booking.service.description}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-purple-600">₹{booking.totalAmount}</p>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mt-2 border ${getStatusColor(booking.status)}`}>
                                        {getStatusIcon(booking.status)}
                                        {booking.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-2">Scheduled Time</h3>
                                    <p className="text-gray-700">
                                        {new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-gray-600 text-sm mt-1">{booking.scheduledTime}</p>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-2">Service Address</h3>
                                    {booking.address && (
                                        <>
                                            <p className="text-gray-700 capitalize font-medium">{booking.address.type}</p>
                                            <p className="text-gray-600 text-sm mt-1">
                                                {booking.address.houseNo}, {booking.address.street}
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                {booking.address.city}, {booking.address.state} {booking.address.pincode}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CreditCard className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-2">Payment Information</h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Payment Status:</span>
                                        <span className={`font-semibold capitalize ${
                                            booking.payment?.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                                        }`}>
                                            {booking.payment?.status || 'Pending'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-gray-600">Amount Paid:</span>
                                        <span className="font-bold text-gray-900">₹{booking.totalAmount}</span>
                                    </div>
                                    {booking.payment?.method && (
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-gray-600">Payment Method:</span>
                                            <span className="font-medium text-gray-700 capitalize">
                                                {booking.payment.method}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                            >
                                Book More Services
                            </button>
                            <button
                                onClick={() => navigate('/booking')}
                                className="flex-1 bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
                            >
                                View All Bookings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ERROR STATE
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">My Bookings</h1>
                        </div>
                    </div>
                </header>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    // ALL BOOKINGS LIST VIEW
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">My Bookings</h1>
                        </div>
                        <button
                            onClick={() => navigate('/help')}
                            className="text-purple-600 font-semibold hover:text-purple-700"
                        >
                            Help
                        </button>
                    </div>
                </div>
            </header>

            {bookings.length === 0 ? (
                <div className="max-w-md mx-auto px-4 py-20 text-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-16 h-16 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet</h2>
                    <p className="text-gray-600 mb-8">
                        Looks like you haven't experienced quality services at home.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition inline-flex items-center gap-2"
                    >
                        Explore our services
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                onClick={() => navigate(`/booking/${booking._id}`)}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        {booking.service?.images?.[0] ? (
                                            <img
                                                src={`https://backend-urbancompany-1.onrender.com${booking.service.images[0]}`}
                                                alt={booking.service.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <Package className="w-10 h-10 text-purple-600" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                                {booking.service?.name || 'Service'}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-2">
                                                Booking ID: #{booking._id.slice(-8)}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{booking.scheduledTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-xl font-bold text-purple-600 mb-2">
                                            ₹{booking.totalAmount}
                                        </p>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                            {getStatusIcon(booking.status)}
                                            {booking.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {booking.address && (
                                    <div className="flex items-start gap-2 text-sm text-gray-600 pt-4 border-t border-gray-100">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <p>
                                            {booking.address.houseNo}, {booking.address.street}, {booking.address.city}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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