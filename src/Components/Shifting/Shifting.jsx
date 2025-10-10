import React from "react";

export default function Shifting() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🏠 Shifting Service
      </h1>

      <p className="text-gray-600 text-center max-w-2xl mb-8">
        Need help moving to your new place? Our shifting service connects you
        with reliable movers who ensure your belongings reach safely and on
        time. Get professional support for home, office, or room shifting.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        {/* Example service cards */}
        <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Local Room Shifting
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Move your room furniture and essentials safely within the city.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Book Now
          </button>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            House Shifting
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Full house moving with packing, loading, and transport services.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Book Now
          </button>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Office Relocation
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Professional shifting for offices with safe handling of equipment.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
