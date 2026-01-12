import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, ShoppingCart, User, MapPin, ChevronDown, TrendingUp, X, Edit2 } from 'lucide-react';
import LoginModal from './LoginModal';
import ProfileEditModal from './ProfileEditModal'; 
import axiosInstance from '../instant/axios';
import { globalSearch, getMyProfile } from '../page/Api';

const SERVER_URL = 'https://backend-urbancompany-1.onrender.com';

export default function UrbanCompanyHeader() {

  const [location, setLocation] = useState('Bhopal, Madhya Pradesh');
  const [currentCity, setCurrentCity] = useState('Bhopal');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); 
  const [showToast, setShowToast] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userData, setUserData] = useState(null);


  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

 
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);


  const [cartCount, setCartCount] = useState(0);

  const placeholders = ['AC Service', 'Kitchen Cleaning', 'Facial'];


  const recentLocations = [
    { name: 'Bhopal', state: 'Madhya Pradesh, India', city: 'Bhopal' },
    { name: 'Connaught Place', state: 'New Delhi, India', city: 'Delhi' },
    { name: 'Karol Bagh', state: 'New Delhi, India', city: 'Delhi' },
    { name: 'Mumbai', state: 'Maharashtra, India', city: 'Mumbai' },
    { name: 'Bangalore', state: 'Karnataka, India', city: 'Bangalore' }
  ];

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    const savedCity = localStorage.getItem('userCity');

    if (savedLocation && savedCity) {
      setLocation(savedLocation);
      setCurrentCity(savedCity);
    }
  }, []);

  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem('recentSearches') || '[]');
    setRecentSearches(saved);
  }, []);

  
  useEffect(() => {
    const fetchProfileFromAPI = async () => {
      const token = localStorage.getItem('authToken');

      // console.log(' Checking auth token...');

      if (!token) {
        setIsLoggedIn(false);
        setUserData(null);
        return;
      }

      try {
        console.log('📡 Fetching user profile from API...');
        
        const response = await getMyProfile();

        if (response.success && response.data) {
          console.log(' Profile fetched successfully');
          console.log('User Name:', response.data.name);
          console.log('User Phone:', response.data.phone);
          console.log('Profile Image:', response.data.profileImage);
          
          setIsLoggedIn(true);
          setUserData(response.data);
          
          fetchCartCount();
        } else {
          throw new Error('Profile fetch failed');
        }
      } catch (error) {
        console.error(' API Error:', error);
        console.log('Logging out user due to API error');
        
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    fetchProfileFromAPI();
  }, []);


  const fetchCartCount = async () => {
    try {
      const response = await axiosInstance.get('/cart/count');
      if (response.data && response.data.success) {
        setCartCount(response.data.data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };


  useEffect(() => {
    const currentPlaceholder = placeholders[placeholderIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = 2000;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPlaceholder.length) {
          setDisplayText(currentPlaceholder.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentPlaceholder.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, placeholderIndex]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-wrapper')) {
        setShowUserMenu(false);
      }
      if (showSearchDropdown && !event.target.closest('.search-wrapper')) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showSearchDropdown]);


  const saveRecentSearch = (query) => {
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
    setRecentSearches(updated);
    sessionStorage.setItem('recentSearches', JSON.stringify(updated));
  };


  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    saveRecentSearch(query);
    setIsSearching(true);

    try {
      const response = await globalSearch(query, currentCity);
      console.log(' Search results for', query, 'in', currentCity, ':', response);

      if (response && response.success) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchFocus = () => {
    setShowSearchDropdown(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };


  const useCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocation('Getting location...');

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      setLocation('Bhopal, Madhya Pradesh');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();

          console.log('Location data:', data);

          const city = data.address.city || data.address.town || data.address.village || 'Bhopal';
          const state = data.address.state || 'Madhya Pradesh';
          const locationText = `${city}, ${state}`;

          setLocation(locationText);
          setCurrentCity(city);

          localStorage.setItem('userLocation', locationText);
          localStorage.setItem('userCity', city);

          setShowLocationModal(false);

          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
        } catch (error) {
          console.error('Error getting location name:', error);
          setLocation('Bhopal, Madhya Pradesh');
          setCurrentCity('Bhopal');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please select manually.');
        setLocation('Bhopal, Madhya Pradesh');
        setCurrentCity('Bhopal');
        setIsGettingLocation(false);
      }
    );
  };

  const selectLocation = (loc) => {
    setLocation(loc.name + ', ' + loc.state.split(',')[0]);
    setCurrentCity(loc.city);

    localStorage.setItem('userLocation', loc.name + ', ' + loc.state.split(',')[0]);
    localStorage.setItem('userCity', loc.city);

    setShowLocationModal(false);
  };

  //  LOGIN SUCCESS - SIRF API SE DATA
  const handleLoginSuccess = async () => {
    try {
      console.log('📡 Fetching fresh profile after login...');
      console.log('API Endpoint: GET /auth/me');
      
      const response = await getMyProfile();
      
      console.log('API Response after login:', response);

      if (response.success && response.data) {
        console.log(' Profile updated after login');
        console.log('User Name:', response.data.name);
        console.log('User Phone:', response.data.phone);
        
        setIsLoggedIn(true);
        setUserData(response.data);
        fetchCartCount();
      } else {
        throw new Error('Profile fetch failed after login');
      }
    } catch (error) {
      console.error('Error fetching profile after login:', error);
      console.log('Logging out due to API error');
      

      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUserData(null);
    }
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };


  const handleProfileUpdate = async (updatedData) => {
    console.log(' Profile updated:', updatedData);
    setUserData(updatedData);
    setShowProfileModal(false);
    
 
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserData(null);
    setShowUserMenu(false);
    setCartCount(0);
    console.log(' Logout successful');
  };


  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${SERVER_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
  };

  return (
    <>
      <header className="border-b border-gray-200 sticky top-0 z-50 py-2 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <NavLink to="/">
                  <img
                    src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_108,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/partner-training/1628575858610-5b0ae4.png"
                    alt="Urban Company"
                  />
                </NavLink>
              </div>

              <nav className="hidden md:flex items-center gap-8 pl-6">
                <NavLink
                  to="/revamp"
                  className={({ isActive }) =>
                    `text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`
                  }
                >
                  Revamp
                </NavLink>
                <NavLink
                  to="/native"
                  className={({ isActive }) =>
                    `text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`
                  }
                >
                  Native
                </NavLink>
                <NavLink
                  to="/beauty"
                  className={({ isActive }) =>
                    `text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`
                  }
                >
                  Beauty
                </NavLink>
              </nav>
            </div>

        
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 mr-15">

                <button
                  onClick={() => setShowLocationModal(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500 max-w-[150px] truncate">
                    {location}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                <div className="hidden lg:flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-white w-80 relative search-wrapper">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={handleSearchFocus}
                    placeholder={`Search in ${currentCity}...`}
                    className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder-gray-500"
                  />
                  {searchQuery && (
                    <button onClick={clearSearch} className="p-1 hover:bg-gray-100 rounded-full">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  )}

                  {showSearchDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[320px] z-50 search-dropdown">
                      {!searchQuery ? (
                        <div className="p-4">
                          {recentSearches.length > 0 ? (
                            <>
                              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Recent searches in {currentCity}
                              </h3>
                              <div className="space-y-1">
                                {recentSearches.slice(0, 8).map((search, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSearch(search)}
                                    className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors"
                                  >
                                    <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                                    {search}
                                  </button>
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                Search in {currentCity}
                              </h3>
                              <p className="text-xs text-gray-500 px-3">
                                Your recent searches will appear here
                              </p>
                            </>
                          )}
                        </div>
                      ) : isSearching ? (
                        <div className="p-6 text-center text-gray-500">Searching in {currentCity}...</div>
                      ) : searchResults ? (
                        <>
                          {searchResults.services?.length > 0 && (
                            <div className="p-3">
                              <h3 className="text-xs font-semibold text-gray-500 mb-2 px-3">
                                Services in {currentCity}
                              </h3>
                              {searchResults.services.map((service) => (
                                <NavLink
                                  key={service._id}
                                  to={`/service/${service.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}/${service._id}`}
                                  onClick={() => {
                                    setShowSearchDropdown(false);
                                    clearSearch();
                                  }}
                                >
                                  <div className="px-3 py-3 hover:bg-gray-50 cursor-pointer rounded-lg flex items-center gap-3 transition-colors">
                                    {service.images?.[0] && (
                                      <img
                                        src={`${service.images[0]}`}
                                        alt={service.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <p className="text-sm font-semibold text-gray-900">{service.name}</p>
                                      <div className="flex items-center gap-3 mt-1.5">
                                        {service.rating && (
                                          <div className="flex items-center gap-1">
                                            <span className="text-xs text-yellow-600">★</span>
                                            <span className="text-xs font-medium text-gray-700">{service.rating}</span>
                                            {service.totalReviews && (
                                              <span className="text-xs text-gray-500">({service.totalReviews})</span>
                                            )}
                                          </div>
                                        )}
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                          ₹{service.discountPrice || service.price}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </NavLink>
                              ))}
                            </div>
                          )}
                          {!searchResults.services?.length &&
                            !searchResults.providers?.length &&
                            !searchResults.categories?.length && (
                              <div className="p-6 text-center text-gray-500">
                                No results found for "{searchQuery}" in {currentCity}
                              </div>
                            )}
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <NavLink to="/cart">
                <button className="relative p-2 hover:bg-gray-100 rounded-full border-gray-200 border border-2 transition-colors">
                  <ShoppingCart className="w-5 h-5 text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </NavLink>

              <div className="relative user-menu-wrapper">
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      setShowUserMenu(!showUserMenu);
                    } else {
                      setShowLoginModal(true);
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isLoggedIn && userData?.profileImage ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500">
                      <img
                        src={getProfileImageUrl(userData.profileImage)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <User className="w-5 h-5 text-gray-700" />
                  )}
                </button>

                {isLoggedIn && showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {userData && (
                      <>
                        <div className="px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                             
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {userData.profileImage ? (
                                  <img
                                    src={getProfileImageUrl(userData.profileImage)}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="w-6 h-6 text-white" />
                                )}
                              </div>
                              
                         
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {userData.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500">+91 {userData.phone}</p>
                              </div>
                            </div>
                            
                           
                            <button
                              onClick={() => {
                                setShowProfileModal(true);
                                setShowUserMenu(false);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                              title="Edit Profile"
                            >
                              <Edit2 className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    <NavLink to="/help">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700">
                        Help Center
                      </button>
                    </NavLink>
                    <NavLink to="/booking">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700">
                        My Bookings
                      </button>
                    </NavLink>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

     
      <ProfileEditModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userData={userData}
        onProfileUpdate={handleProfileUpdate}
      />

      {showLocationModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl max-w-lg w-full relative">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full z-10"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Search for your location/city"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="flex-1 text-sm text-gray-700 outline-none"
                />
              </div>

              <button
                onClick={useCurrentLocation}
                disabled={isGettingLocation}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 rounded-lg transition-colors ${isGettingLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-purple-600">
                  {isGettingLocation ? 'Getting location...' : 'Use current location'}
                </span>
              </button>
            </div>

            <div className="p-6 max-h-[400px] overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Popular Cities</h3>
              <div className="space-y-2">
                {recentLocations
                  .filter(loc =>
                    !locationSearch ||
                    loc.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
                    loc.state.toLowerCase().includes(locationSearch.toLowerCase())
                  )
                  .map((loc, index) => (
                    <button
                      key={index}
                      onClick={() => selectLocation(loc)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="mt-1">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#9CA3AF" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">{loc.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{loc.state}</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-20 right-4 z-[60] animate-slide-in">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <span className="font-medium">Location Updated!</span>
          </div>
        </div>
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
        
        .search-dropdown::-webkit-scrollbar {
          display: none;
        }
        .search-dropdown {
          -ms-overflow-style: none;
          scrollbar-width: none;
          overflow-y: hidden;
        }
      `}</style>
    </>
  );
}