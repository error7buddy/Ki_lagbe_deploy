import React, { useState } from "react";
import axios from "axios";
import { auth } from "../../Firebase/config";

export default function Advertise_home() {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    bhk: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [showBuyPopup, setShowBuyPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedPack, setSelectedPack] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImages(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return setMessage("Please log in first!");

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    for (let i = 0; i < images.length; i++) data.append("images", images[i]);
    data.append("user_id", user.uid);

    try {
      const res = await axios.post("http://localhost:5000/api/advertisements", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) setMessage("✅ Ad posted successfully!");
      else setMessage(res.data.error || "⚠️ Something went wrong.");
      setFormData({ title: "", address: "", bhk: "", description: "" });
      setImages([]);
    } catch (error) {
      console.error("Error posting ad:", error);
      if (error.response?.status === 403) {
        setMessage("⚠️ No ads left. Please buy more ads.");
        setShowBuyPopup(true);
      } else setMessage("❌ Failed to post advertisement.");
    }
  };

  const handleBuyConfirm = (pack) => {
    setSelectedPack(pack);
    setShowPaymentPopup(true);
  };

  const handlePaymentConfirm = async () => {
    const user = auth.currentUser;
    if (!user) return setMessage("Please log in first!");

    try {
      const res = await axios.post("http://localhost:5000/api/buy-ads", {
        user_id: user.uid,
        packType: selectedPack,
        method: selectedMethod,
      });

      if (res.data.success) {
        setMessage("✅ Purchase successful! You can post more ads now.");
        setShowBuyPopup(false);
        setShowPaymentPopup(false);
      } else {
        alert("❌ Payment failed. Try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("⚠️ Payment error. Try again later.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 relative">
      <h1 className="text-2xl font-bold mb-6">Post an Advertisement</h1>
      {message && <p className="text-center text-red-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="bhk" placeholder="BHK (e.g. 2BHK)" value={formData.bhk} onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="file" multiple onChange={handleImageChange} className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-800">Post Ad</button>
      </form>

      {/* Buy Ads Popup */}
      {showBuyPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white shadow-2xl rounded-2xl p-6 w-80 border border-gray-200">
            <h2 className="text-xl font-semibold mb-3 text-center">Buy Ad Packs</h2>
            <div className="space-y-2">
              <button onClick={() => handleBuyConfirm("5_ads")} className="w-full p-2 bg-yellow-100 hover:bg-yellow-200 rounded">5 Ads – 200৳</button>
              <button onClick={() => handleBuyConfirm("10_ads")} className="w-full p-2 bg-blue-100 hover:bg-blue-200 rounded">10 Ads – 350৳</button>
              <button onClick={() => handleBuyConfirm("yearly")} className="w-full p-2 bg-green-100 hover:bg-green-200 rounded">Yearly Unlimited – 1000৳</button>
            </div>
            <button onClick={() => setShowBuyPopup(false)} className="mt-4 w-full bg-gray-300 rounded p-2 hover:bg-gray-400">Cancel</button>
          </div>
        </div>
      )}

      {/* Payment Popup */}
      {showPaymentPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white shadow-2xl rounded-2xl p-6 w-80">
            <h2 className="text-lg font-semibold mb-3 text-center">Select Payment Method</h2>
            <div className="grid grid-cols-2 gap-2">
              {["bKash", "Nagad", "Rocket", "Visa", "MasterCard", "Paytm", "GooglePay"].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMethod(m)}
                  className={`p-2 rounded border text-sm ${
                    selectedMethod === m
                      ? "bg-yellow-500 text-white border-yellow-600"
                      : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-5">
              <button onClick={() => setShowPaymentPopup(false)} className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button
                onClick={handlePaymentConfirm}
                disabled={!selectedMethod}
                className={`px-3 py-2 rounded text-white ${
                  selectedMethod ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
