import { useEffect, useState } from "react";
import { api } from "../../api/axios.js";
import Spinner from "../../components/Spinner.jsx";

export default function TransactionHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/payments/transactions")
      .then((r) => setItems(r.data.items))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Transaction History</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        All your successful Stripe payments.
      </p>

      {items.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No transactions yet.
        </div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Ticket Title</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-mono text-xs">
                    {t.stripePaymentIntentId.slice(0, 18)}…
                  </td>
                  <td className="px-4 py-3">{t.ticketTitle}</td>
                  <td className="px-4 py-3 font-semibold text-brand-700 dark:text-brand-300">
                    ৳{t.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {new Date(t.paymentDate).toLocaleString()}
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
