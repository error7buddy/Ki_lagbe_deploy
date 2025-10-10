import React, { useState } from "react";
import axios from "axios";

const BookShifting = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    from_location: "",
    from_floor: "",
    to_location: "",
    to_floor: "",
    shift_type: "",
    date: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/shifting-orders", form);
    alert("Shifting order booked successfully! We will contact you soon.");
    setForm({
      name: "",
      phone: "",
      from_location: "",
      from_floor: "",
      to_location: "",
      to_floor: "",
      shift_type: "",
      date: "",
      message: "",
    });
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Book a Shifting Service</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="from_location"
          placeholder="From Location"
          value={form.from_location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="from_floor"
          placeholder="From Floor"
          value={form.from_floor}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="to_location"
          placeholder="To Location"
          value={form.to_location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="to_floor"
          placeholder="To Floor"
          value={form.to_floor}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="shift_type"
          value={form.shift_type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Shift Type</option>
          <option value="Home">Home</option>
          <option value="Office">Office</option>
          <option value="Furniture">Furniture</option>
        </select>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="message"
          placeholder="Additional Message"
          value={form.message}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button className="w-full bg-green-600 text-white p-2 rounded">
          Submit Booking
        </button>
      </form>
    </div>
  );
};

export default BookShifting;
