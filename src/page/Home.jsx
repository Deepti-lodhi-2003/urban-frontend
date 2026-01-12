import React, { useState, useEffect } from 'react';
import Header from "../component/Header"
import Slider from './Slider';
import Slider2 from './Slider2';
import BookedSlider from './BookedSlider';
import WomenSlider from './WomenSlider';
import WomenSpaSlider from './WomenSpaSlider';
import CleaningEsential from './CleaningEsential';
import ServiceRepair from './ServiceRepair';
import HomeRepair from './HomeRepair';
import MassageMen from './MassageMen';
import SalonForMen from './SalonForMen';
import Footer from '../component/Footer';
import ServiceCategoryModal from './ServiceCategoryModal'; 
import { NavLink } from 'react-router-dom';
import { fetchCategories, fetchServices, getImageUrl } from './Api';

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  
  const instaHelpImages = [
    "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1750845033589-98cdfb.jpeg",
    "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1678864013225-bfc1de.jpeg",
    "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1699869110346-61ab83.jpeg",
    "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1678868062337-08bfc2.jpeg"
  ];

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await fetchCategories();
        
        if (response.success && response.data) {
          // Add Insta Help as first item
          const instaHelp = {
            _id: 'insta-help',
            name: 'Insta Help',
            image: instaHelpImages[0],
            badge: 'NEW',
            isInstaHelp: true,
            isActive: true
          };
          
          // Filter only active categories and sort by order
          const activeCategories = response.data
            .filter(cat => cat.isActive)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          
          setCategories([instaHelp, ...activeCategories]);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        // Set empty array on error so UI doesn't break
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Animate Insta Help images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % instaHelpImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Function to open modal with selected category and fetch services
  const handleServiceClick = async (category) => {
    // Don't open modal for Insta Help
    if (category.isInstaHelp) {
      return;
    }

    try {
      setServicesLoading(true);
      setSelectedCategory({
        name: category.name,
        description: category.description || `Professional ${category.name} services`,
        id: category._id
      });
      setIsModalOpen(true);

      // Fetch services for this category
      const response = await fetchServices({
        category: category._id,
        limit: 50 // Get more services
      });

      if (response.success && response.data && response.data.services) {
        // Transform API services to match modal format
        const transformedServices = response.data.services.map(service => ({
          id: service._id,
          name: service.name,
          icon: '🛠️', // Default icon
          price: service.discountPrice || service.price,
          originalPrice: service.price !== service.discountPrice ? service.price : null,
          rating: service.rating || 0,
          image: service.images && service.images.length > 0 ? service.images[0] : null,
          duration: service.duration,
          description: service.description
        }));

        setServices(transformedServices);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setServicesLoading(false);
    }
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setServices([]);
  };

  // Function to handle subcategory/service click
  const handleSubcategoryClick = (service) => {
    console.log('Selected service:', service);
    // Navigate to service details page
    window.location.href = `/service/${service.id}`;
    handleCloseModal();
  };

  return (
    <>
      <Header/>

      <div className="min-h-screen bg-white pt-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Left Section - Services */}
            <div className="w-full flex flex-col">
              <div className="mb-6 md:mb-8 px-1 md:px-2">
                <h1 className="text-2xl md:text-4xl font-semibold text-gray-900">
                  Home services at your<br />doorstep
                </h1>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex-1 w-[92vw] sm:w-[35vw]">
                <h2 className="text-lg font-semibold text-gray-700 mb-6">
                  What are you looking for?
                </h2>

                {/* Loading State */}
                {loading ? (
                  <div className="grid grid-cols-3 gap-5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-[25vw] sm:w-[10vw] h-20 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
                        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : categories.length === 0 ? (
                  // Empty State
                  <div className="text-center py-8">
                    <p className="text-gray-500">No categories available at the moment.</p>
                  </div>
                ) : (
                  /* Services Grid */
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-5">
                    {categories.map((category) => (
                      <div
                        key={category._id}
                        className="relative transition-all group"
                        onClick={() => handleServiceClick(category)}
                      >
                        {category.isInstaHelp ? (
                          // Special Insta Help card with animation
                          <NavLink to="/instahelp">
                            <div className="flex flex-col items-center justify-center text-center cursor-pointer">
                              <div className="relative mb-3 rounded-lg py-4 px-4 hover:bg-gray-100 cursor-pointer w-[25vw] sm:w-[10vw] flex items-center justify-center overflow-hidden" style={{backgroundColor:"rgba(245, 245, 245, 1.00)", height: "80px"}}>
                                <span className="absolute top-1 right-1 bg-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded z-10">
                                  NEW
                                </span>
                                {instaHelpImages.map((img, idx) => (
                                  <img 
                                    key={idx}
                                    src={img} 
                                    alt="Service" 
                                    className="w-12 h-12 object-contain absolute transition-all duration-500 ease-in-out"
                                    style={{
                                      opacity: idx === currentImageIndex ? 1 : 0,
                                      transform: idx === currentImageIndex 
                                        ? 'translateY(0) scale(1)' 
                                        : 'translateY(20px) scale(0.8)',
                                    }}
                                  />
                                ))}
                              </div>
                              <p className="text-xs font-medium text-gray-700 leading-tight">
                                {category.name}
                              </p>
                            </div>
                          </NavLink>
                        ) : (
                          // Regular service cards from API
                          <>
                            {category.badge && (
                              <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded z-10">
                                {category.badge}
                              </span>
                            )}
                            <div className="flex flex-col items-center justify-center text-center cursor-pointer">
                              <div className="mb-3 rounded-lg py-4 px-4 hover:bg-gray-100 cursor-pointer w-[25vw] sm:w-[10vw] flex items-center justify-center" style={{backgroundColor:"rgba(245, 245, 245, 1.00)"}}>
                                <img 
                                  src={getImageUrl(category.image)} 
                                  alt={category.name} 
                                  className="w-14 h-14 object-contain"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/56?text=Service';
                                  }}
                                />
                              </div>
                              <p className="text-xs font-medium text-gray-700 leading-tight">
                                {category.name}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats Section */}
              <div className="flex items-center gap-10 sm:gap-18 mt-12">
                <div className="flex items-center gap-3">
                  <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_48,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1693570188661-dba2e7.jpeg" alt="" />
                  <div>
                    <div className="text-xl font-semibold text-gray-900">4.8</div>
                    <div className="text-sm text-gray-600">Service Rating*</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_48,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1693491890812-e86755.jpeg" alt="" />
                  <div>
                    <div className="text-xl font-semibold text-gray-900">12M+</div>
                    <div className="text-sm text-gray-600">Customers Globally*</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Single Image */}
            <div className="hidden lg:block h-[650px]">
              <img
                src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1696852847761-574450.jpeg"
                alt="Women's Salon"
                className="w-full h-full object-cover rounded-2xl min-h-[550px]"
              />
            </div>
          </div>
        </div>
      </div>

      <Slider/>
      <Slider2/>
      <BookedSlider/>

      <div className="w-full bg-white py-8 md:py-12">
        <div className="max-w-[1400px] mx-auto lg:px-12">
          <div className="overflow-hidden shadow-sm cursor-pointer">
            <img 
              src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1736922795409-bece35.jpeg" 
              alt="Banner" 
              className="w-full h-auto transition-transform duration-300 ease-out hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>

      <WomenSlider/>
      <WomenSpaSlider/>

      <div className="w-full bg-white py-8 md:py-12">
        <div className="max-w-[1400px] mx-auto lg:px-12">
          <div className="overflow-hidden shadow-sm cursor-pointer">
            <img 
              src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1766332966102-820e8e.jpeg" 
              alt="Banner" 
              className="w-full h-auto transition-transform duration-300 ease-out hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>

      <CleaningEsential/>

      <div className="w-full bg-white py-8 md:py-12">
        <div className="max-w-[1400px] mx-auto lg:px-12">
          <div className="overflow-hidden shadow-sm cursor-pointer">
            <img 
              src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1735893886310-6dbc53.jpeg" 
              alt="Banner" 
              className="w-full h-auto transition-transform duration-300 ease-out hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>

      <ServiceRepair/>
      <HomeRepair/>
      <MassageMen/>

      <div className="w-full bg-white py-8 md:py-12">
        <div className="max-w-[1400px] mx-auto lg:px-12">
          <div className="overflow-hidden shadow-sm cursor-pointer">
            <img 
              src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1766332185953-2ecf53.jpeg" 
              alt="Banner" 
              className="w-full h-auto transition-transform duration-300 ease-out hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>

      <SalonForMen/>
      <Footer/>

      {/* Modal Component */}
      <ServiceCategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
        subcategories={services}
        onSubcategoryClick={handleSubcategoryClick}
        loading={servicesLoading}
      />
    </>
  );
}