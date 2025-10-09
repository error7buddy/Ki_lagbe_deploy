import React, { useState } from "react";
import axios from "axios";
import { auth } from "../../Firebase/config"; // import Firebase auth

export default function Advertise_home() {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    bhk: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser; // ✅ Get Firebase user
    if (!user) {
      setMessage("Please log in first!");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    data.append("user_id", user.uid); // ✅ Use Firebase UID

    try {
      const res = await axios.post("http://localhost:5000/api/advertisements", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.limitReached) {
        setMessage("⚠️ Free ad limit reached. Please upgrade to Premium!");
      } else {
        setMessage("✅ Ad posted successfully!");
      }

      setFormData({ title: "", address: "", bhk: "", description: "" });
      setImages([]);
    } catch (error) {
      console.error("Error posting ad:", error);
      setMessage("❌ Failed to post ad.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Post an Advertisement</h1>

      {message && <p className="mb-4 text-center text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="bhk"
          placeholder="BHK (e.g. 2BHK)"
          value={formData.bhk}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
        >
          Post Ad
        </button>
      </form>
    </div>
  );
}
