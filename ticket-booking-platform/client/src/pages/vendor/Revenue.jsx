import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { api } from "../../api/axios.js";
import Spinner from "../../components/Spinner.jsx";

const COLORS = ["#1d73f5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function RevenueOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/vendor/revenue")
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return null;

  const chartData = (data.breakdown || []).map((b) => ({
    name: b._id,
    sold: b.count,
    revenue: b.revenue,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold">Revenue Overview</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Summary of your ticket sales and revenue.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Tickets added" value={data.ticketsAdded} color="brand" />
        <StatCard label="Tickets sold" value={data.ticketsSold} color="emerald" />
        <StatCard label="Total revenue" value={`৳${data.revenue.toLocaleString()}`} color="amber" />
      </div>

      {chartData.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No sales yet. Once you have paid bookings, charts will appear here.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card p-4">
            <h3 className="mb-3 font-semibold">Tickets sold by transport type</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sold" fill="#1d73f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-4">
            <h3 className="mb-3 font-semibold">Revenue share by transport type</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="revenue"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  const map = {
    brand: "bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-300",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-slate-800 dark:text-emerald-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-slate-800 dark:text-amber-300",
  };
  return (
    <div className={`card p-4 ${map[color]}`}>
      <div className="text-xs uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-3xl font-extrabold">{value}</div>
    </div>
  );
}
