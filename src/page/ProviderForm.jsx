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

  const [errors, setErrors] = useState({});
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.experience || formData.experience === '') {
      newErrors.experience = 'Experience is required';
    } else if (parseInt(formData.experience) < 0) {
      newErrors.experience = 'Experience cannot be negative';
    } else if (parseInt(formData.experience) > 50) {
      newErrors.experience = 'Experience cannot exceed 50 years';
    }

    if (!formData.categories) {
      newErrors.categories = 'Please select a service category';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Please add at least one skill';
    }

    if (!formData.serviceArea.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.serviceArea.city.length < 2) {
      newErrors.city = 'City name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.serviceArea.city)) {
      newErrors.city = 'City name can only contain letters';
    }

    if (formData.serviceArea.localities.length === 0) {
      newErrors.localities = 'Please add at least one locality';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
  
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addLocality = () => {
    const trimmedLocality = localityInput.trim();
    
    if (!trimmedLocality) {
      setErrors(prev => ({ ...prev, localityInput: 'Locality cannot be empty' }));
      return;
    }

    if (trimmedLocality.length < 2) {
      setErrors(prev => ({ ...prev, localityInput: 'Locality must be at least 2 characters' }));
      return;
    }

    if (formData.serviceArea.localities.includes(trimmedLocality)) {
      setErrors(prev => ({ ...prev, localityInput: 'This locality is already added' }));
      return;
    }

    if (formData.serviceArea.localities.length >= 10) {
      setErrors(prev => ({ ...prev, localityInput: 'Maximum 10 localities allowed' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      serviceArea: {
        ...prev.serviceArea,
        localities: [...prev.serviceArea.localities, trimmedLocality]
      }
    }));
    setLocalityInput('');
    setErrors(prev => ({ ...prev, localityInput: '', localities: '' }));
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
    const trimmedSkill = skillInput.trim().toLowerCase();
    
    if (!trimmedSkill) {
      setErrors(prev => ({ ...prev, skillInput: 'Skill cannot be empty' }));
      return;
    }

    if (trimmedSkill.length < 2) {
      setErrors(prev => ({ ...prev, skillInput: 'Skill must be at least 2 characters' }));
      return;
    }

    if (!/^[a-z\s]+$/.test(trimmedSkill)) {
      setErrors(prev => ({ ...prev, skillInput: 'Skill can only contain letters' }));
      return;
    }

    if (formData.skills.includes(trimmedSkill)) {
      setErrors(prev => ({ ...prev, skillInput: 'This skill is already added' }));
      return;
    }

    if (formData.skills.length >= 10) {
      setErrors(prev => ({ ...prev, skillInput: 'Maximum 10 skills allowed' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, trimmedSkill]
    }));
    setSkillInput('');
    setErrors(prev => ({ ...prev, skillInput: '', skills: '' }));
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
    if (!validateForm()) {
      setApiError('Please fill all required fields correctly');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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
        setApiError(error.response.data?.message || 'Registration failed. Please try again.');
      } else if (error.request) {
        setApiError('Network error. Please check your connection and try again.');
      } else {
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
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  max="50"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 5"
                />
                {errors.experience && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.experience}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  Service Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="categories"
                  value={formData.categories}
                  onChange={handleInputChange}
                  disabled={loadingCategories}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.categories ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                {errors.categories && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.categories}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-5 md:mb-6">
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                Add Skills <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    if (errors.skillInput) {
                      setErrors(prev => ({ ...prev, skillInput: '' }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                    errors.skillInput ? 'border-red-500' : 'border-gray-300'
                  }`}
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
              {errors.skillInput && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.skillInput}
                </p>
              )}
              {errors.skills && formData.skills.length === 0 && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.skills}
                </p>
              )}
              
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
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.serviceArea.city}
                  onChange={handleServiceAreaChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Delhi, Mumbai"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  Localities <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={localityInput}
                    onChange={(e) => {
                      setLocalityInput(e.target.value);
                      if (errors.localityInput) {
                        setErrors(prev => ({ ...prev, localityInput: '' }));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLocality();
                      }
                    }}
                    className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                      errors.localityInput ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                {errors.localityInput && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.localityInput}
                  </p>
                )}
                {errors.localities && formData.serviceArea.localities.length === 0 && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.localities}
                  </p>
                )}
                
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