import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdvertisementList() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3); // 👈 initially show 3

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/advertisements")
      .then((res) => {
        setAds(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ads:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Loading ads...</p>;
  if (ads.length === 0) return <p className="text-center">No ads available</p>;

  // 👇 Slice ads to show only the visible ones
  const visibleAds = ads.slice(0, visibleCount);

  return (
    <div className="flex flex-col items-center">
      {/* Ads Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {visibleAds.map((ad) => {
          let images = [];
          try {
            images = JSON.parse(ad.images || "[]");
          } catch (e) {
            images = [];
          }

          return (
            <div
              key={ad.id}
              className="border rounded-lg shadow-md overflow-hidden"
            >
              {images.length > 0 && (
                <img
                  src={`http://localhost:5000/${images[0]}`}
                  alt={ad.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold">{ad.title}</h2>
                <p className="text-gray-600">{ad.address}</p>
                <p className="text-gray-800 font-medium mt-2">{ad.bhk}</p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {ad.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* See More / See Less Button */}
      {ads.length > 3 && (
        <button
          onClick={() =>
            setVisibleCount((prev) =>
              prev >= ads.length ? 3 : prev + 5 // 👈 reveal 5 more, reset if all shown
            )
          }
          className="mt-6 flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800"
        >
          {visibleCount >= ads.length ? (
            <>
              ↑ See Less
            </>
          ) : (
            <>
              ↓ See More
            </>
          )}
        </button>
      )}
    </div>
  );
}
