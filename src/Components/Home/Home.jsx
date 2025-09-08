import React from "react";
import AdvertisementList from "./AdvertisementsList";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-6 mt-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Available Houses for Rent</h1>
      <AdvertisementList />
    </div>
  );
}
