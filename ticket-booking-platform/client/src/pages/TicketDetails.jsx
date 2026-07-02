import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaBus, FaTrain, FaPlane, FaShip, FaClock, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa6";
import { api } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Spinner from "../components/Spinner.jsx";

const transportIcon = {
  bus: <FaBus />,
  train: <FaTrain />,
  plane: <FaPlane />,
  launch: <FaShip />,
};

function Countdown({ date }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = new Date(date).getTime() - now;
  if (diff <= 0) {
    return <span className="text-red-600">Departed</span>;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return (
    <span className="font-mono font-semibold">
      {days}d {hours}h {mins}m {secs}s
    </span>
  );
}

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthed } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/tickets/${id}`)
      .then((r) => setTicket(r.data.ticket))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!ticket)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Ticket not found</h1>
      </div>
    );

  const departed = new Date(ticket.departureDate).getTime() < Date.now();
  const soldOut = ticket.quantity <= 0;
  const tooMuch = Number(quantity) > ticket.quantity;

  async function handleBook(e) {
    e.preventDefault();
    if (!isAuthed) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/bookings", { ticketId: ticket._id, quantity: Number(quantity) });
      toast.success("Booking request sent! Status: pending");
      setOpen(false);
      navigate("/dashboard/bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          {ticket.image ? (
            <img src={ticket.image} alt={ticket.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-72 items-center justify-center text-6xl text-slate-400">
              {transportIcon[ticket.transportType]}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="badge bg-brand-100 text-brand-800 capitalize">{ticket.transportType}</span>
          <h1 className="mt-2 text-3xl font-extrabold">{ticket.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <FaMapMarkerAlt /> {ticket.from} → {ticket.to}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <FaClock className="text-brand-600" />
              Departure: <strong>{new Date(ticket.departureDate).toLocaleString()}</strong>
            </div>
            <div>
              Time left: <Countdown date={ticket.departureDate} />
            </div>
            <div>Available seats: <strong>{ticket.quantity}</strong></div>
            <div>Vendor: <strong>{ticket.vendorName}</strong> ({ticket.vendorEmail})</div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(ticket.perks || []).map((p) => (
              <span key={p} className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                <FaCheckCircle className="mr-1 inline" /> {p}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-end justify-between rounded-xl bg-brand-50 p-4 dark:bg-slate-800">
            <div>
              <div className="text-3xl font-extrabold text-brand-700 dark:text-brand-300">
                ৳{ticket.price.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">per seat</div>
            </div>
            <button
              className="btn-primary"
              disabled={departed || soldOut}
              onClick={() => setOpen(true)}
            >
              {soldOut ? "Sold out" : departed ? "Departed" : "Book Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Booking modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Book this ticket</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {ticket.title} — ৳{ticket.price.toLocaleString()} × {quantity} = ৳{(ticket.price * quantity).toLocaleString()}
            </p>
            <form onSubmit={handleBook} className="mt-4 space-y-3">
              <div>
                <label className="label">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={ticket.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="input"
                  required
                />
                {tooMuch && (
                  <p className="mt-1 text-xs text-red-600">
                    Quantity can't exceed available seats ({ticket.quantity})
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting || tooMuch}>
                  {submitting ? "Submitting…" : "Confirm booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
