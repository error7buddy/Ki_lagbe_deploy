import React, { useState } from 'react';

export default function Advertise_home() {
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    image: null
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.slug.trim()) newErrors.slug = 'Field not entered!';
    if (!formData.title.trim()) newErrors.title = 'Title is required!';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Form submitted:', formData);
    // Add submission logic here
  };

  const handleCancel = () => {
    setFormData({ slug: '', title: '', description: '', image: null });
    setErrors({});
    setImagePreview(null);
  };

  return (
<div className="max-w-xl mx-auto p-6 mt-16 md:mt-20 lg:mt-40 mb-20 md:mb-28 lg:mb-40 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Advertise Home Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.slug ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter slug"
          />
          {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter title"
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <div className="flex items-center space-x-3">
            <label className="flex flex-col items-center px-3 py-1 bg-white text-blue-600 rounded-lg border border-blue-600 cursor-pointer hover:bg-blue-50 text-sm">
              Choose Image
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {imagePreview && (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => { setFormData(prev => ({ ...prev, image: null })); setImagePreview(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-600">* - required fields</p>

        {/* Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            Create
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
