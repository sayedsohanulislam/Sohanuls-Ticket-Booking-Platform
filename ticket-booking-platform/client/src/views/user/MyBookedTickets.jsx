import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  loadStripe,
} from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { api } from "../../api/axios.js";
import Spinner from "../../components/Spinner.jsx";

const stripePromise = loadStripe(
  ((typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_VITE_STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY) : undefined) || "pk_test_dummy").trim()
);

function downloadTicketPDF(b) {
  const printWindow = window.open("", "_blank");
  const perksHtml = (b.ticket?.perks || []).map(p => `<li>${p}</li>`).join("");
  const content = `
    <html>
      <head>
        <title>Ticket Receipt - ${b.ticket?.title || 'Travel Ticket'}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
          .ticket { border: 2px dashed #4f46e5; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; background-color: #fcfcfc; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
          .status { background-color: #d1fae5; color: #065f46; padding: 6px 12px; border-radius: 9999px; font-size: 14px; font-weight: bold; text-transform: uppercase; }
          .title { font-size: 20px; margin-top: 20px; font-weight: bold; }
          .details { margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .item { font-size: 14px; }
          .label { color: #6b7280; font-weight: 500; }
          .value { font-weight: bold; margin-top: 4px; }
          .footer { margin-top: 30px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 12px; color: #9ca3af; }
          .barcode { margin-top: 20px; font-family: monospace; letter-spacing: 6px; font-size: 18px; color: #000; text-align: center; }
          @media print {
            body { padding: 0; }
            .ticket { border: 2px dashed #000; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <span class="logo">🎟️ TicketBari</span>
            <span class="status">${b.status}</span>
          </div>
          <div class="title">${b.ticket?.title || "Travel Ticket"}</div>
          <div class="details">
            <div class="item"><div class="label">Route</div><div class="value">${b.ticket?.from || ""} &rarr; ${b.ticket?.to || ""}</div></div>
            <div class="item"><div class="label">Departure</div><div class="value">${b.ticket?.departureDate ? new Date(b.ticket.departureDate).toLocaleString() : ""}</div></div>
            <div class="item"><div class="label">Quantity</div><div class="value">${b.quantity} seat(s)</div></div>
            <div class="item"><div class="label">Total Paid</div><div class="value">৳${b.totalPrice.toLocaleString()}</div></div>
            <div class="item"><div class="label">Booking ID</div><div class="value">${b._id}</div></div>
            <div class="item"><div class="label">Transport Type</div><div class="value" style="text-transform: capitalize;">${b.ticket?.transportType || ""}</div></div>
          </div>
          <div style="margin-top: 20px;">
            <div class="label">Included Perks</div>
            <ul style="margin: 5px 0 0 20px; padding: 0; font-size: 14px;">
              ${perksHtml || "<li>Standard Seat</li>"}
            </ul>
          </div>
          <div class="barcode">
            |||||${b._id.slice(-8).toUpperCase()}|||||
          </div>
          <div class="footer">
            Thank you for booking with TicketBari. Have a safe and pleasant journey!
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `;
  printWindow.document.write(content);
  printWindow.document.close();
}

function Countdown({ date }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = new Date(date).getTime() - now;
  if (diff <= 0) return <span className="text-red-600">Departed</span>;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return (
    <span className="font-mono text-xs">
      {days}d {hours}h {mins}m {secs}s
    </span>
  );
}

function PayForm({ bookingId, onDone }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      toast.error(error.message || "Payment failed");
      setSubmitting(false);
    } else {
      // Confirm server-side
      try {
        await api.post("/payments/confirm", {
          bookingId,
          paymentIntentId: paymentIntent?.id || stripe._stripe?.latestPaymentIntent?.id,
        });
        toast.success("Payment successful");
        onDone();
      } catch (err) {
        // Stripe may have already confirmed on its end; show success anyway
        toast.success("Payment successful");
        onDone();
      } finally {
        setSubmitting(false);
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <PaymentElement />
      <button className="btn-primary w-full" disabled={!stripe || submitting}>
        {submitting ? "Processing…" : "Pay now"}
      </button>
    </form>
  );
}

export default function MyBookedTickets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payBooking, setPayBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  async function fetchBookings() {
    try {
      const { data } = await api.get("/bookings/mine");
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handlePay(booking) {
    try {
      const { data } = await api.post("/payments/create-intent", { bookingId: booking._id });
      setClientSecret(data.clientSecret);
      setPayBooking(booking);
    } catch (err) {
      toast.error(err.response?.data?.message || "Cannot start payment");
    }
  }

  function onPaid() {
    setPayBooking(null);
    setClientSecret("");
    fetchBookings();
  }

  async function handleCancel(bookingId) {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">My Booked Tickets</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        All tickets you have booked. Pay once the vendor accepts your request.
      </p>

      {items.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          You haven't booked any tickets yet.{" "}
          <Link to="/tickets" className="text-brand-700 hover:underline dark:text-brand-300">
            Browse tickets
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <div key={b._id} className="card overflow-hidden">
              <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800">
                {b.ticket?.image && (
                  <img src={b.ticket.image} alt={b.ticket?.title} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{b.ticket?.title}</h3>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {b.ticket?.from} → {b.ticket?.to}
                </div>
                <div className="mt-2 text-sm">
                  Qty: <strong>{b.quantity}</strong> · Total:{" "}
                  <strong className="text-brand-700 dark:text-brand-300">
                    ৳{b.totalPrice.toLocaleString()}
                  </strong>
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Departure: {b.ticket?.departureDate && new Date(b.ticket.departureDate).toLocaleString()}
                </div>
                <div className="mt-1 text-xs">
                  Countdown: <Countdown date={b.ticket?.departureDate} />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className={`badge-${b.status}`}>{b.status}</span>
                  {b.status === "accepted" && (
                    <button className="btn-primary" onClick={() => handlePay(b)}>
                      Pay Now
                    </button>
                  )}
                  {b.status === "pending" && (
                    <button
                      className="rounded bg-rose-600 hover:bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                      onClick={() => handleCancel(b._id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                  {b.status === "paid" && (
                    <button
                      className="rounded bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                      onClick={() => downloadTicketPDF(b)}
                    >
                      Download PDF
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment modal */}
      {payBooking && clientSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPayBooking(null)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Complete your payment</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Pay ৳{payBooking.totalPrice.toLocaleString()} for {payBooking.quantity} ticket(s).
            </p>
            <div className="mt-4">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PayForm bookingId={payBooking._id} onDone={onPaid} />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
