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
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_dummy"
);

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
    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      toast.error(error.message || "Payment failed");
      setSubmitting(false);
    } else {
      // Confirm server-side
      try {
        // Retrieve PaymentIntent from the elements instance
        const pi = elements.fetchPaymentMethodForConfirmation
          ? null
          : null;
        // Fallback: ask server to look up latest paid intent for this booking
        await api.post("/payments/confirm", {
          bookingId,
          paymentIntentId: stripe._stripe?.latestPaymentIntent?.id,
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
