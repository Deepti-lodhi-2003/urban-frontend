import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CreditCard, Phone, Mail, CheckCircle, Package, Loader2 } from 'lucide-react';

// Import your API function
import { getBookingById } from '../page/Api';

export default function MyBookingsPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetails();
        } else {
            setLoading(false);
        }
    }, [bookingId]);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    // If there's a bookingId but error loading
    if (bookingId && error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">My Booking</h1>
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

    // If there's a booking, show booking details
    if (bookingId && booking) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
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

                {/* Success Message */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                        <p className="text-gray-600">Your service has been booked successfully</p>
                        <p className="text-sm text-gray-500 mt-2">Booking ID: #{booking._id.slice(-8)}</p>
                    </div>

                    {/* Booking Details */}
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
                                    <p className="text-xs text-gray-500 mt-1 capitalize">{booking.status}</p>
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
                                onClick={() => navigate('/my-bookings')}
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

    // Empty state - no bookingId provided
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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

            {/* Empty State */}
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
        </div>
    );
}