import { Link } from "react-router-dom";
import { FaBus, FaTrain, FaPlane, FaShip, FaArrowRight } from "react-icons/fa6";

const transportIcon = {
  bus: <FaBus />,
  train: <FaTrain />,
  plane: <FaPlane />,
  launch: <FaShip />,
};

const transportLabel = {
  bus: "Bus",
  train: "Train",
  plane: "Plane",
  launch: "Launch",
};

export default function TicketCard({ ticket, variant = "default" }) {
  const departed = new Date(ticket.departureDate).getTime() < Date.now();
  const soldOut = ticket.quantity <= 0;

  return (
    <div className="card flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {ticket.image ? (
          <img
            src={ticket.image}
            alt={ticket.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl text-slate-400">
            {transportIcon[ticket.transportType] || <FaBus />}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-brand-600/90 px-2.5 py-0.5 text-xs font-semibold text-white">
          {transportLabel[ticket.transportType]}
        </span>
        {soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-semibold text-slate-900 dark:text-slate-100">
          {ticket.title}
        </h3>

        {variant === "extended" && (
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {ticket.from} → {ticket.to}
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-1.5">
          {(ticket.perks || []).slice(0, 3).map((p) => (
            <span
              key={p}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {p}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-lg font-bold text-brand-700 dark:text-brand-300">
              ৳{ticket.price.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {ticket.quantity} seats left
            </div>
          </div>
          <Link
            to={`/tickets/${ticket._id}`}
            className="btn-primary"
            disabled={soldOut || departed}
          >
            See details <FaArrowRight />
          </Link>
        </div>

        {variant === "extended" && (
          <div className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Departure: {new Date(ticket.departureDate).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
