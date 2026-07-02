import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaBus, FaTrain, FaPlane, FaShip, FaClock, FaLocationDot, FaCircleCheck } from "react-icons/fa6";
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

function BusSeatMap({ totalSeats = 40, availableSeats = 30, selectedSeats, onSelectSeat, ticketId }) {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const bookedCount = Math.max(0, totalSeats - availableSeats);
  const bookedIndices = new Set();
  
  let seed = 0;
  for (let c = 0; c < ticketId.length; c++) {
    seed += ticketId.charCodeAt(c);
  }
  
  let i = 0;
  while (bookedIndices.size < bookedCount && i < totalSeats) {
    const candidate = (seed + i * 7) % totalSeats;
    bookedIndices.add(candidate);
    i++;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
        Front of Bus / Driver
      </div>
      
      <div className="grid grid-cols-5 gap-3 max-w-[280px] mx-auto">
        {rows.map((rowLetter, rowIndex) => {
          return (
            <div key={rowLetter} className="col-span-5 grid grid-cols-5 gap-2 items-center">
              {Array.from({ length: 2 }).map((_, seatIdx) => {
                const label = `${rowLetter}${seatIdx + 1}`;
                const seatIndex = rowIndex * 4 + seatIdx;
                const isBooked = bookedIndices.has(seatIndex);
                const isSelected = selectedSeats.includes(label);
                
                return (
                  <button
                    key={label}
                    type="button"
                    disabled={isBooked}
                    onClick={() => onSelectSeat(label)}
                    className={`h-8 w-8 rounded-md flex items-center justify-center text-[10px] font-semibold transition-all
                      ${isBooked 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600' 
                        : isSelected
                          ? 'bg-brand-600 text-white shadow-md'
                          : 'bg-white border border-slate-300 text-slate-700 hover:border-brand-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
              
              <div className="text-center text-[8px] font-bold text-slate-300 dark:text-slate-700">
                Aisle
              </div>
              
              {Array.from({ length: 2 }).map((_, seatIdx) => {
                const label = `${rowLetter}${seatIdx + 3}`;
                const seatIndex = rowIndex * 4 + seatIdx + 2;
                const isBooked = bookedIndices.has(seatIndex);
                const isSelected = selectedSeats.includes(label);
                
                return (
                  <button
                    key={label}
                    type="button"
                    disabled={isBooked}
                    onClick={() => onSelectSeat(label)}
                    className={`h-8 w-8 rounded-md flex items-center justify-center text-[10px] font-semibold transition-all
                      ${isBooked 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600' 
                        : isSelected
                          ? 'bg-brand-600 text-white shadow-md'
                          : 'bg-white border border-slate-300 text-slate-700 hover:border-brand-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex justify-center gap-3 text-[10px]">
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-white border border-slate-300 dark:bg-slate-800 dark:border-slate-700" />
          <span>Avail</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-brand-600" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-slate-200 dark:bg-slate-800" />
          <span>Booked</span>
        </div>
      </div>
    </div>
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
  const [selectedSeats, setSelectedSeats] = useState([]);
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

  const handleSelectSeat = (seatLabel) => {
    setSelectedSeats((prev) => {
      const next = prev.includes(seatLabel)
        ? prev.filter((s) => s !== seatLabel)
        : [...prev, seatLabel];
      setQuantity(next.length);
      return next;
    });
  };

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
            <FaLocationDot /> {ticket.from} → {ticket.to}
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
                <FaCircleCheck className="mr-1 inline" /> {p}
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
              onClick={() => {
                setSelectedSeats([]);
                setQuantity(ticket.transportType === "bus" ? 0 : 1);
                setOpen(true);
              }}
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
              {ticket.transportType === "bus" ? (
                <div>
                  <label className="label mb-2">Select Seats</label>
                  <BusSeatMap
                    totalSeats={40}
                    availableSeats={ticket.quantity}
                    selectedSeats={selectedSeats}
                    onSelectSeat={handleSelectSeat}
                    ticketId={ticket._id}
                  />
                  <div className="mt-3 text-sm">
                    Selected Seats: <strong>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</strong> (Qty: {quantity})
                  </div>
                </div>
              ) : (
                <div>
                  <label className="label">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={ticket.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="input"
                    required
                  />
                  {tooMuch && (
                    <p className="mt-1 text-xs text-red-600">
                      Quantity can't exceed available seats ({ticket.quantity})
                    </p>
                  )}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting || tooMuch || (ticket.transportType === "bus" && selectedSeats.length === 0)}
                >
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
