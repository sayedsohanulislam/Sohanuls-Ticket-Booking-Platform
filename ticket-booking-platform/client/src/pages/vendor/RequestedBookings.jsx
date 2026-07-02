import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa6";
import { api } from "../../api/axios.js";
import Spinner from "../../components/Spinner.jsx";

export default function RequestedBookings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchRequests() {
    try {
      const { data } = await api.get("/bookings/requests");
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function handleAccept(id) {
    try {
      await api.patch(`/bookings/${id}/accept`);
      toast.success("Booking accepted — user can now pay");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  }
  async function handleReject(id) {
    if (!confirm("Reject this booking request?")) return;
    try {
      await api.patch(`/bookings/${id}/reject`);
      toast.success("Booking rejected");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Requested Bookings</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Booking requests from users for your tickets.
      </p>

      {items.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No booking requests yet.
        </div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Ticket</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">
                    <div className="font-medium">{b.user?.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{b.user?.email}</div>
                  </td>
                  <td className="px-4 py-3">{b.ticket?.title}</td>
                  <td className="px-4 py-3">{b.quantity}</td>
                  <td className="px-4 py-3 font-semibold text-brand-700 dark:text-brand-300">
                    ৳{b.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge-${b.status}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {b.status === "pending" && (
                      <div className="flex gap-2">
                        <button className="btn-primary px-3 py-1" onClick={() => handleAccept(b._id)}>
                          <FaCheck /> Accept
                        </button>
                        <button className="btn-danger px-3 py-1" onClick={() => handleReject(b._id)}>
                          <FaTimes /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
