import React, { useState, useEffect } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BASE_URL = 'https://backend-urbancompany-1.onrender.com/api';

export default function ProviderForm() {
  const [formData, setFormData] = useState({
    businessName: '',
    experience: '',
    skills: [],
    categories: '',
    serviceArea: {
      city: '',
      localities: [],
      radius: 10
    }
  });

  const [files, setFiles] = useState({
    aadhar: null,
    pan: null,
    certificate: null 
  });

  const [localityInput, setLocalityInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/categories`);
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceAreaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      serviceArea: {
        ...prev.serviceArea,
        [name]: value
      }
    }));
  };

  const addLocality = () => {
    if (localityInput.trim() && !formData.serviceArea.localities.includes(localityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        serviceArea: {
          ...prev.serviceArea,
          localities: [...prev.serviceArea.localities, localityInput.trim()]
        }
      }));
      setLocalityInput('');
    }
  };

  const removeLocality = (locality) => {
    setFormData(prev => ({
      ...prev,
      serviceArea: {
        ...prev.serviceArea,
        localities: prev.serviceArea.localities.filter(l => l !== locality)
      }
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim().toLowerCase()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [fileType]: file }));
    }
  };

  const removeFile = (fileType) => {
    setFiles(prev => ({ ...prev, [fileType]: null }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setApiError('');

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setApiError('Please login first to register as a provider');
        setIsSubmitting(false);
        return;
      }

      
      const formDataToSend = new FormData();
      
     
      formDataToSend.append('businessName', formData.businessName || '');
      formDataToSend.append('experience', formData.experience || '0');
      formDataToSend.append('categories', formData.categories || '');
      
     
      formDataToSend.append('skills', JSON.stringify(formData.skills));
      
     
      formDataToSend.append('serviceArea', JSON.stringify({
        city: formData.serviceArea.city || '',
        localities: formData.serviceArea.localities || [],
        radius: formData.serviceArea.radius || 10
      }));
      
      
      if (files.aadhar) {
        formDataToSend.append('aadhar', files.aadhar);
      }
      
      if (files.pan) {
        formDataToSend.append('pan', files.pan);
      }
      
      if (files.certificate) {
        formDataToSend.append('certificate', files.certificate);
      }

      console.log('Submitting provider registration...');
      console.log('Business Name:', formData.businessName);
      console.log('Experience:', formData.experience);
      console.log('Skills:', formData.skills);
      console.log('Category ID:', formData.categories);
      console.log('Service Area:', formData.serviceArea);
      console.log('Files:', {
        aadhar: files.aadhar?.name,
        pan: files.pan?.name,
        certificate: files.certificate?.name
      });

     
      const response = await axios.post(
        `${BASE_URL}/providers/register`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Registration successful:', response.data);

      if (response.data.success) {
        setSubmitSuccess(true);

        
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setApiError(response.data.message || 'Registration failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('API Error:', error);
      
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        setApiError(error.response.data?.message || 'Registration failed. Please try again.');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setApiError('Network error. Please check your connection and try again.');
      } else {
        console.error('Error:', error.message);
        setApiError('An error occurred. Please try again.');
      }
      
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Registration Successful!</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">Your provider registration has been submitted successfully. We'll review your application and get back to you soon.</p>
          <div className="animate-pulse text-xs md:text-sm text-gray-500">Redirecting...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-4 md:py-8 px-3 md:px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-1 md:mb-2">Become a Service Provider</h1>
          <p className="text-gray-600 text-xs md:text-base">Join Our Company and grow your business</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">Registration Failed</p>
                <p className="text-xs text-red-600 mt-1">{apiError}</p>
              </div>
            </div>
          )}

          <div className="mb-5 md:mb-6">
            <div className="space-y-3">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your business name"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="e.g., 5"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  Service Category
                </label>
                <select
                  name="categories"
                  value={formData.categories}
                  onChange={handleInputChange}
                  disabled={loadingCategories}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingCategories ? 'Loading categories...' : 'Select a category'}
                  </option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-5 md:mb-6">
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                Add Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="e.g., plumbing, electrical"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 md:px-6 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold whitespace-nowrap"
                >
                  Add
                </button>
              </div>
              
              {formData.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2 md:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 md:ml-2 hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-5 md:mb-6">
            <div className="space-y-3">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.serviceArea.city}
                  onChange={handleServiceAreaChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="e.g., Delhi, Mumbai"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  Localities
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={localityInput}
                    onChange={(e) => setLocalityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLocality();
                      }
                    }}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="e.g., Connaught Place"
                  />
                  <button
                    type="button"
                    onClick={addLocality}
                    className="px-4 md:px-6 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                
                {formData.serviceArea.localities.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.serviceArea.localities.map(locality => (
                      <span
                        key={locality}
                        className="inline-flex items-center px-2 md:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {locality}
                        <button
                          type="button"
                          onClick={() => removeLocality(locality)}
                          className="ml-1 md:ml-2 hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  Service Radius (km): {formData.serviceArea.radius}
                </label>
                <div className="relative">
                  <input
                    type="range"
                    name="radius"
                    value={formData.serviceArea.radius}
                    onChange={handleServiceAreaChange}
                    min="1"
                    max="50"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((formData.serviceArea.radius - 1) / 49) * 100}%, #e5e7eb ${((formData.serviceArea.radius - 1) / 49) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 km</span>
                  <span>50 km</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5 md:mb-6">
            <div className="space-y-3">
              {['aadhar', 'pan', 'certificate'].map(docType => (
                <div key={docType}>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2 capitalize">
                    {docType === 'aadhar' ? 'Aadhar Card' : docType === 'pan' ? 'PAN Card' : 'Certificate (Optional)'}
                  </label>
                  
                  {!files[docType] ? (
                    <label className="flex items-center justify-center w-full px-3 py-4 md:py-5 border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 rounded-lg cursor-pointer transition">
                      <div className="text-center">
                        <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-gray-400" />
                        <p className="text-xs md:text-sm text-gray-600">
                          Click to upload {docType === 'aadhar' ? 'Aadhar' : docType === 'pan' ? 'PAN' : 'Certificate'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                      </div>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, docType)}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 md:gap-3 min-w-0">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs md:text-sm font-medium text-gray-800 truncate">{files[docType].name}</p>
                          <p className="text-xs text-gray-500">
                            {(files[docType].size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(docType)}
                        className="text-red-600 hover:text-red-800 flex-shrink-0 ml-2"
                      >
                        <X className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center pt-4 md:pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full md:w-auto px-8 md:px-12 py-3 rounded-lg font-bold text-sm md:text-base transition-all transform active:scale-95 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-purple-900 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Register as Provider'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}