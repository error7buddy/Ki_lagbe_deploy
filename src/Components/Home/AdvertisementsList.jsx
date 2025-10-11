import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdvertisementList() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6); // show 3 initially

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

  if (loading) return <p className="text-center mt-6">Loading ads...</p>;
  if (ads.length === 0)
    return <p className="text-center mt-6">No ads available</p>;

  // show only visible ads
  const visibleAds = ads.slice(0, visibleCount);

  return (
    <div className="flex flex-col items-center p-6">
      {/* Ads Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {visibleAds.map((ad) => {
          let images = [];
          try {
            images = JSON.parse(ad.images || "[]");
          } catch {
            images = [];
          }

          // Combine address parts
          const fullAddress = [ad.houseNo, ad.area, ad.district]
            .filter(Boolean)
            .join(", ");

          return (
            <div
              key={ad.id}
              className="border rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition-all"
            >
              {images.length > 0 && (
                <img
                  src={`http://localhost:5000/${images[0]}`}
                  alt={ad.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                {/* Title */}
                <h2 className="text-lg font-semibold mb-1">{ad.title}</h2>

                {/* Address */}
                {fullAddress && (
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Address:</span> {fullAddress}
                  </p>
                )}

                {/* Phone Number */}
                {ad.phone && (
                  <p className="text-gray-700 text-sm mb-1">
                    <span className="font-medium">📞 Phone:</span> {ad.phone}
                  </p>
                )}

                {/* BHK */}
                <p className="text-gray-800 font-medium">{ad.bhk}</p>

                {/* Description */}
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
              prev >= ads.length ? 3 : prev + 5 // reveal 5 more or reset
            )
          }
          className="mt-6 flex items-center gap-2 text-white font-semibold p-1 pr-5 pl-5 rounded-xl bg-black hover:bg-gray-900 transition-colors"
        >
          {visibleCount >= ads.length ? "↑ See Less" : "↓ See More"}
        </button>
      )}
    </div>
  );
}
