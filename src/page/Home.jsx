import React from 'react';
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
import ServiceCategoryModal from './ServiceCategoryModal'; // Import your modal component
import { NavLink } from 'react-router-dom';

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  
  const instaHelpImages = [
    "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1750845033589-98cdfb.jpeg",
    "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1678864013225-bfc1de.jpeg",
    "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1699869110346-61ab83.jpeg",
    "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1678868062337-08bfc2.jpeg"
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % instaHelpImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      id: 1,
      name: "Insta Help",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1750845033589-98cdfb.jpeg",
      badge: "NEW",
      subcategories: [
        { id: 11, name: "Quick Repairs", icon: "🔧", price: 299 },
        { id: 12, name: "Emergency Services", icon: "🚨", price: 499 },
        { id: 13, name: "Home Inspection", icon: "🏠", price: 599 }
      ]
    },
    {
      id: 2,
      name: "Women's Salon & Spa",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1678864013225-bfc1de.jpeg",
      badge: null,
      description: "Professional beauty services at home",
      subcategories: [
        { id: 21, name: "Salon for Women", icon: "💇‍♀️", price: 399 },
        { id: 22, name: "Spa for Women", icon: "💆‍♀️", price: 1299 },
        { id: 23, name: "Hair Studio for Women", icon: "✂️", price: 599 },
        { id: 24, name: "Makeup & Styling Studio", icon: "💄", price: 1999 }
      ]
    },
    {
      id: 3,
      name: "Men's Salon & Massage",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1750845033589-98cdfb.jpeg",
      badge: null,
      description: "Grooming services for men",
      subcategories: [
        { id: 31, name: "Men's Haircut", icon: "💈", price: 299 },
        { id: 32, name: "Beard Styling", icon: "🧔", price: 199 },
        { id: 33, name: "Massage Therapy", icon: "💆‍♂️", price: 899 },
        { id: 34, name: "Facial for Men", icon: "🧖‍♂️", price: 599 }
      ]
    },
    {
      id: 4,
      name: "Cleaning & Pest Control",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1699869110346-61ab83.jpeg",
      badge: null,
      description: "Keep your home clean and pest-free",
      subcategories: [
        { id: 41, name: "Bathroom Cleaning", icon: "🚿", price: 399 },
        { id: 42, name: "Kitchen Cleaning", icon: "🍳", price: 499 },
        { id: 43, name: "Pest Control", icon: "🐜", price: 699 },
        { id: 44, name: "Full Home Cleaning", icon: "🏡", price: 1499 }
      ]
    },
    {
      id: 5,
      name: "Electrician, Plumber & Carpenter",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1678868062337-08bfc2.jpeg",
      badge: null,
      description: "Expert home repair services",
      subcategories: [
        { id: 51, name: "Electrician", icon: "⚡", price: 199 },
        { id: 52, name: "Plumber", icon: "🔧", price: 249 },
        { id: 53, name: "Carpenter", icon: "🪚", price: 299 },
        { id: 54, name: "Door Repair", icon: "🚪", price: 349 }
      ]
    },
    {
      id: 6,
      name: "Native Water Purifier",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1765884886041-216ec5.jpeg",
      badge: null,
      subcategories: [
        { id: 61, name: "RO Installation", icon: "💧", price: 499 },
        { id: 62, name: "RO Service", icon: "🔧", price: 299 },
        { id: 63, name: "Water Testing", icon: "🧪", price: 199 }
      ]
    },
    {
      id: 7,
      name: "Painting & Waterproofing",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1674120935535-f8d5c8.jpeg",
      badge: null,
      subcategories: [
        { id: 71, name: "Wall Painting", icon: "🎨", price: 2999 },
        { id: 72, name: "Waterproofing", icon: "💦", price: 4999 },
        { id: 73, name: "Texture Painting", icon: "🖌️", price: 3499 }
      ]
    },
    {
      id: 8,
      name: "AC & Appliance Repair",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1751547558710-5ff49a.jpeg",
      badge: null,
      subcategories: [
        { id: 81, name: "AC Service", icon: "❄️", price: 399 },
        { id: 82, name: "AC Repair", icon: "🔧", price: 599 },
        { id: 83, name: "Washing Machine Repair", icon: "🧺", price: 349 },
        { id: 84, name: "Refrigerator Repair", icon: "🧊", price: 449 }
      ]
    },
    {
      id: 9,
      name: "Wall makeover by Revamp",
      image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1724138391296-c1780b.jpeg",
      badge: null,
      subcategories: [
        { id: 91, name: "Wall Design", icon: "🎨", price: 3999 },
        { id: 92, name: "Wallpaper Installation", icon: "📜", price: 2499 },
        { id: 93, name: "Wall Art", icon: "🖼️", price: 1999 }
      ]
    }
  ];

  // Function to open modal with selected category
  const handleServiceClick = (service) => {
    setSelectedCategory({
      name: service.name,
      description: service.description || `Professional ${service.name} services`,
      id: service.id
    });
    setIsModalOpen(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  // Function to handle subcategory click
  const handleSubcategoryClick = (subcategory) => {
    console.log('Selected subcategory:', subcategory);
    // Add your navigation or booking logic here
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

                {/* Services Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-5">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="relative transition-all group"
                      onClick={() => handleServiceClick(service)}
                    >
                      {service.id === 1 ? (
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
                            {service.name}
                          </p>
                        </div>
                        </NavLink>
                      ) : (
                        // Regular service cards
                        <>
                          {service.badge && (
                            <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded z-10">
                              {service.badge}
                            </span>
                          )}
                          <div className="flex flex-col items-center justify-center text-center cursor-pointer">
                            <div className="mb-3 rounded-lg py-4 px-4 hover:bg-gray-100 cursor-pointer w-[25vw] sm:w-[10vw] flex items-center justify-center" style={{backgroundColor:"rgba(245, 245, 245, 1.00)"}}>
                              <img src={service.image} alt={service.name} className="w-14 h-14 object-contain" />
                            </div>
                            <p className="text-xs font-medium text-gray-700 leading-tight">
                              {service.name}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
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
        subcategories={selectedCategory ? services.find(s => s.id === selectedCategory.id)?.subcategories || [] : []}
        onSubcategoryClick={handleSubcategoryClick}
      />
    </>
  );
}