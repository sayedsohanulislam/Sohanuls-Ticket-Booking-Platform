import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa6";
import { api } from "../../api/axios.js";
import Spinner from "../../components/Spinner.jsx";

export default function ManageTickets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTickets() {
    try {
      const { data } = await api.get("/tickets/admin/all");
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  async function handleVerify(id, status) {
    try {
      await api.patch(`/tickets/${id}/verify`, { status });
      toast.success(`Ticket ${status}`);
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Tickets</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Approve or reject tickets submitted by vendors.
      </p>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Transport</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">No tickets yet.</td>
              </tr>
            ) : (
              items.map((t) => (
                <tr key={t._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium">{t.title}</td>
                  <td className="px-4 py-3">{t.from} → {t.to}</td>
                  <td className="px-4 py-3 capitalize">{t.transportType}</td>
                  <td className="px-4 py-3">৳{t.price.toLocaleString()}</td>
                  <td className="px-4 py-3">{t.quantity}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{t.vendorName}</div>
                    <div className="text-xs text-slate-500">{t.vendorEmail}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge-${t.verificationStatus}`}>{t.verificationStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        className="btn-primary px-3 py-1"
                        disabled={t.verificationStatus === "approved"}
                        onClick={() => handleVerify(t._id, "approved")}
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        className="btn-danger px-3 py-1"
                        disabled={t.verificationStatus === "rejected"}
                        onClick={() => handleVerify(t._id, "rejected")}
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
