import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/axios.js";
import Spinner from "../../components/Spinner.jsx";

export default function AdvertiseTickets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTickets() {
    try {
      const { data } = await api.get("/tickets/admin/all");
      setItems(data.items.filter((t) => t.verificationStatus === "approved"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  async function toggleAdvertise(t) {
    try {
      await api.patch(`/tickets/${t._id}/advertise`, {});
      toast.success(t.isAdvertised ? "Removed from advertisement" : "Now advertised");
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  }

  if (loading) return <Spinner />;

  const advertisedCount = items.filter((t) => t.isAdvertised).length;

  return (
    <div>
      <h1 className="text-2xl font-bold">Advertise Tickets</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Choose up to 6 approved tickets to feature on the homepage.
      </p>

      <div className="card mt-4 p-4 text-sm">
        Currently advertised: <strong>{advertisedCount}</strong> / 6
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Transport</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t._id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 font-medium">{t.title}</td>
                <td className="px-4 py-3">{t.from} → {t.to}</td>
                <td className="px-4 py-3 capitalize">{t.transportType}</td>
                <td className="px-4 py-3">৳{t.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  {t.isAdvertised ? (
                    <span className="badge-paid">advertised</span>
                  ) : (
                    <span className="badge-pending">not advertised</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5"
                      checked={!!t.isAdvertised}
                      onChange={() => toggleAdvertise(t)}
                    />
                    <span>{t.isAdvertised ? "Remove" : "Advertise"}</span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
