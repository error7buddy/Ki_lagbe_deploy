import React, { useEffect, useState } from "react";

const AdminShifting = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/shifting-orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching shifting orders:", error);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Delete this shifting order?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/shifting-orders/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        alert("✅ Order deleted successfully!");
      } else {
        alert("❌ Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleMarkComplete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/shifting-orders/${id}/complete`, {
        method: "PUT",
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Order marked as completed!");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🚚 Manage Shifting Orders</h1>

      {orders.length === 0 ? (
        <p>No shifting orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">From</th>
                <th className="border p-2">To</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="border p-2">{o.name}</td>
                  <td className="border p-2">{o.phone}</td>
                  <td className="border p-2">
                    <div>{o.from_location}</div>
                    <div className="text-xs text-gray-500">
                      Floor: {o.from_floor || "N/A"}
                    </div>
                  </td>
                  <td className="border p-2">
                    <div>{o.to_location}</div>
                    <div className="text-xs text-gray-500">
                      Floor: {o.to_floor || "N/A"}
                    </div>
                  </td>
                  <td className="border p-2">{o.shift_type}</td>
                  <td className="border p-2">{o.date}</td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 text-white rounded ${
                        o.status === "Completed" ? "bg-green-600" : "bg-yellow-500"
                      }`}
                    >
                      {o.status || "Pending"}
                    </span>
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    {o.status !== "Completed" && (
                      <button
                        onClick={() => handleMarkComplete(o.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteOrder(o.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminShifting;
