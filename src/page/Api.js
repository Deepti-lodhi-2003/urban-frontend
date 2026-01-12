import axios from 'axios';

const BASE_URL = 'https://backend-urbancompany-1.onrender.com/api';
const SERVER_URL = 'https://backend-urbancompany-1.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
     
      window.location.href = '/'; 
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// ==================== AUTHENTICATION APIs ====================

/**
 * Send OTP to phone number
 */
export const sendOTP = async (phone) => {
  try {
    const response = await api.post('/auth/send-otp', { phone });
    console.log('OTP sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

/**
 * Verify OTP and login
 */
export const verifyOTP = async (phone, otp) => {
  try {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    console.log('OTP verified:', response);
    return response;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

/**
 * Get current user profile
 */
export const getMyProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// ==================== SERVICE APIs ====================

/**
 * Get all services with filters and pagination
 */
export const fetchServices = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      category = '',
      minPrice = '',
      maxPrice = '',
      search = ''
    } = options;

    const params = {
      page,
      limit,
      ...(category && { category }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      ...(search && { search }),
    };

    const response = await api.get('/services', { params });
    // console.log('Services fetched:', response);
    return response;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * Get single service by ID
 */
export const fetchServiceById = async (serviceId) => {
  try {
    const response = await api.get(`/services/${serviceId}`);
    return response;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

// ==================== CATEGORY APIs ====================

/**
 * Get all categories
 */
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Get category by ID
 */
export const fetchCategoryById = async (categoryId) => {
  try {
    const response = await api.get(`/categories/${categoryId}`);
    return response;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// ==================== CART APIs ====================

/**
 * Get cart
 */
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (serviceId, quantity = 1) => {
  try {
    const response = await api.post('/cart/add', { serviceId, quantity });
    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

/**
 * Update cart item
 */
export const updateCartItem = async (serviceId, quantity) => {
  try {
    const response = await api.put(`/cart/update/${serviceId}`, { quantity });
    return response;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (serviceId) => {
  try {
    const response = await api.delete(`/cart/remove/${serviceId}`);
    return response;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

/**
 * Clear cart
 */
export const clearCart = async () => {
  try {
    const response = await api.delete('/cart/clear');
    return response;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

/**
 * Get cart count
 */
export const getCartCount = async () => {
  try {
    const response = await api.get('/cart/count');
    return response;
  } catch (error) {
    console.error('Error fetching cart count:', error);
    throw error;
  }
};

/**
 * Apply coupon
 */
export const applyCoupon = async (couponCode) => {
  try {
    const response = await api.post('/cart/coupon/apply', { couponCode });
    return response;
  } catch (error) {
    console.error('Error applying coupon:', error);
    throw error;
  }
};

/**
 * Remove coupon
 */
export const removeCoupon = async () => {
  try {
    const response = await api.delete('/cart/coupon/remove');
    return response;
  } catch (error) {
    console.error('Error removing coupon:', error);
    throw error;
  }
};

// ==================== BOOKING APIs ====================

/**
 * Create booking
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

/**
 * Get my bookings
 */
export const getMyBookings = async (params = {}) => {
  try {
    const response = await api.get('/bookings/my-bookings', { params });
    return response;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    return response;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

/**
 * Cancel booking
 */
export const cancelBooking = async (bookingId, cancellationReason) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/cancel`, {
      cancellationReason
    });
    return response;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};
// ==================== ADDRESS APIs ====================

/**
 * Get all addresses
 */
export const getAddresses = async () => {
  try {
    const response = await api.get('/addresses');
    return response;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
};

/**
 * Create address
 */
export const createAddress = async (addressData) => {
  try {
    const response = await api.post('/addresses', addressData);
    return response;
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
};

/**
 * Update address
 */
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await api.put(`/addresses/${addressId}`, addressData);
    return response;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

/**
 * Delete address
 */
export const deleteAddress = async (addressId) => {
  try {
    const response = await api.delete(`/addresses/${addressId}`);
    return response;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

// ==================== SEARCH API ====================

/**
 * Global search
 */
export const globalSearch = async (query, city = '') => {
  try {
    const params = { query };
    
    // Add city filter if provided
    if (city) {
      params.city = city;
    }
    
    // console.log(' Searching for:', query, 'in city:', city || 'all cities');
    
    const response = await api.get('/search', { params });
    return response;
  } catch (error) {
    console.error('Error searching:', error);
    throw error;
  }
};

// ==================== PAYMENT APIs ====================

/**
 * Create Razorpay order
 */
export const createRazorpayOrder = async (bookingId) => {
  try {
    const response = await api.post('/payments/create-order', { bookingId });
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Verify payment
 */
export const verifyPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments/verify', paymentData);
    return response;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

/**
 * Cash payment
 */
export const cashPayment = async (bookingId) => {
  try {
    const response = await api.post('/payments/cash', { bookingId });
    return response;
  } catch (error) {
    console.error('Error processing cash payment:', error);
    throw error;
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Helper function - Image URL banana
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/300x225?text=No+Image';
  }
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const fullUrl = imagePath.startsWith('/') 
    ? `${SERVER_URL}${imagePath}` 
    : `${SERVER_URL}/${imagePath}`;
  
  return fullUrl;
};

/**
 * Helper function - Format price
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Check if user is logged in
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};


// Export axios instance for custom requests
export { api };
export { BASE_URL, SERVER_URL };