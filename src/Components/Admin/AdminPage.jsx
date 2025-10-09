import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();

  // Protect route
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch all ads
  const fetchAds = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/advertisements");
      const data = await res.json();
      setAds(data);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Delete ad
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/advertisements/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        setAds((prev) => prev.filter((ad) => ad.id !== id));
        alert("✅ Ad deleted successfully!");
      } else {
        alert("❌ Failed to delete ad.");
      }
    } catch (error) {
      console.error("Error deleting ad:", error);
      alert("Error deleting ad. Check console.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {ads.length === 0 ? (
        <p>No ads found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad.id} className="p-4 border rounded-lg shadow bg-white">
              <h2 className="text-xl font-bold">{ad.title}</h2>
              <p>{ad.description}</p>
              {ad.images &&
                JSON.parse(ad.images).map((img, i) => (
                  <img
                    key={i}
                    src={`http://localhost:5000/${img}`}
                    alt="ad"
                    className="w-full h-40 object-cover mt-2 rounded"
                  />
                ))}
              <button
                onClick={() => handleDelete(ad.id)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
