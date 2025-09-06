import React, { useState } from "react";
import axios from "axios";

export default function Advertise_home() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    bhk: "1BHK",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title required";
    if (!formData.address.trim()) newErrors.address = "Address required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("address", formData.address);
    data.append("bhk", formData.bhk);
    formData.images.forEach(file => data.append("images", file));

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/advertisements", data);
      alert(res.data.message);
      setFormData({ title: "", description: "", address: "", bhk: "1BHK", images: [] });
      setImagePreviews([]);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-16 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Advertise Home Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-2 py-1 border rounded-md ${errors.title ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.title && <p className="text-red-600 text-xs">{errors.title}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={`w-full px-2 py-1 border rounded-md ${errors.address ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.address && <p className="text-red-600 text-xs">{errors.address}</p>}
        </div>

        {/* BHK Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">BHK</label>
          <select
            name="bhk"
            value={formData.bhk}
            onChange={handleInputChange}
            className="w-full px-2 py-1 border rounded-md"
          >
            <option>1BHK</option>
            <option>2BHK</option>
            <option>3BHK</option>
            <option>4BHK</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-2 py-1 border rounded-md"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input type="file" multiple onChange={handleImageChange} />
          <div className="flex space-x-2 mt-2">
            {imagePreviews.map((src, idx) => (
              <img key={idx} src={src} className="w-16 h-16 object-cover rounded" />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Create"}
        </button>
      </form>
    </div>
  );
}
