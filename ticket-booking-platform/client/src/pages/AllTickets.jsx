import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/axios.js";
import TicketCard from "../components/TicketCard.jsx";
import Spinner from "../components/Spinner.jsx";

export default function AllTickets() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(Number(params.get("page") || 1));
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [from, setFrom] = useState(params.get("from") || "");
  const [to, setTo] = useState(params.get("to") || "");
  const [transportType, setTransportType] = useState(params.get("transportType") || "all");
  const [sort, setSort] = useState(params.get("sort") || "");

  async function fetchTickets() {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (from) q.set("from", from);
      if (to) q.set("to", to);
      if (transportType && transportType !== "all") q.set("transportType", transportType);
      if (sort) q.set("sort", sort);
      q.set("page", page);
      q.set("limit", 6);
      const { data } = await api.get(`/tickets?${q.toString()}`);
      setItems(data.items);
      setPages(data.pages);
      setTotal(data.total);
      setParams(q, { replace: true });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, transportType]);

  function onSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchTickets();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-extrabold">All Tickets</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Browse approved travel tickets across bus, train, launch and plane.
      </p>

      {/* Filters */}
      <form
        onSubmit={onSearch}
        className="card mt-6 grid grid-cols-1 gap-4 p-4 md:grid-cols-5"
      >
        <div>
          <label className="label">From</label>
          <input
            className="input"
            placeholder="e.g. Dhaka"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <label className="label">To</label>
          <input
            className="input"
            placeholder="e.g. Chittagong"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Transport</label>
          <select
            className="input"
            value={transportType}
            onChange={(e) => setTransportType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="bus">Bus</option>
            <option value="train">Train</option>
            <option value="launch">Launch</option>
            <option value="plane">Plane</option>
          </select>
        </div>
        <div>
          <label className="label">Sort by price</label>
          <select
            className="input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Newest</option>
            <option value="asc">Low → High</option>
            <option value="desc">High → Low</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" className="btn-primary w-full">Search</button>
        </div>
      </form>

      {/* Result meta */}
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>{total} tickets found</span>
        {pages > 1 && (
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span>
              Page {page} / {pages}
            </span>
            <button
              className="btn-secondary"
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="mt-4">
        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 dark:border-slate-700">
            No tickets match your filters. Try adjusting your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => (
              <TicketCard key={t._id} ticket={t} variant="extended" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
