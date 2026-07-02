import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaArrowRight, FaBus, FaTrain, FaPlane, FaShip, FaShieldAlt, FaHeadset, FaWallet } from "react-icons/fa6";
import { api } from "../api/axios.js";
import TicketCard from "../components/TicketCard.jsx";
import Spinner from "../components/Spinner.jsx";

const slides = [
  {
    title: "Bus tickets, anywhere in Bangladesh",
    desc: "Compare AC, non-AC and sleeper buses on every popular route.",
    bg: "from-brand-600 to-brand-800",
    icon: <FaBus className="h-16 w-16" />,
  },
  {
    title: "Trains, on your schedule",
    desc: "Reserve seats on intercity trains before they sell out.",
    bg: "from-emerald-600 to-emerald-800",
    icon: <FaTrain className="h-16 w-16" />,
  },
  {
    title: "Launches along the rivers",
    desc: "Cabin and deck tickets for the most scenic river routes.",
    bg: "from-indigo-600 to-indigo-800",
    icon: <FaShip className="h-16 w-16" />,
  },
  {
    title: "Flights to every division",
    desc: "Domestic flights with transparent pricing, no hidden fees.",
    bg: "from-rose-600 to-rose-800",
    icon: <FaPlane className="h-16 w-16" />,
  },
];

export default function Home() {
  const [advertised, setAdvertised] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/tickets/advertised").then((r) => r.data.items).catch(() => []),
      api.get("/tickets/latest").then((r) => r.data.items).catch(() => []),
    ])
      .then(([adv, lat]) => {
        setAdvertised(adv);
        setLatest(lat);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero slider */}
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-[400px] md:h-[480px]"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className={`flex h-full items-center bg-gradient-to-br ${s.bg} px-6 text-white md:px-16`}>
              <div className="max-w-2xl">
                <div className="mb-4 opacity-80">{s.icon}</div>
                <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">{s.title}</h1>
                <p className="mt-3 text-base md:text-lg opacity-90">{s.desc}</p>
                <Link to="/tickets" className="btn-secondary mt-6 inline-flex">
                  Browse all tickets <FaArrowRight />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold md:text-3xl">Why choose TicketBari?</h2>
        <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
          One platform for every journey across bus, train, launch and flight.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { icon: <FaShieldAlt />, title: "Secure payments", desc: "All payments are processed through Stripe with industry-standard encryption." },
            { icon: <FaHeadset />, title: "24/7 support", desc: "Our support team is available round-the-clock for any booking-related issues." },
            { icon: <FaWallet />, title: "Best prices", desc: "We work directly with vendors to bring you the most competitive prices." },
          ].map((c, i) => (
            <div key={i} className="card p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-2xl text-brand-700 dark:bg-slate-800 dark:text-brand-300">
                {c.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Advertisement Section (admin-curated) */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Tickets</h2>
          <Link to="/tickets" className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300">
            See all →
          </Link>
        </div>
        {loading ? (
          <Spinner />
        ) : advertised.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
            No featured tickets yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {advertised.map((t) => (
              <TicketCard key={t._id} ticket={t} />
            ))}
          </div>
        )}
      </section>

      {/* Latest tickets */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-4 text-2xl font-bold">Latest Tickets</h2>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((t) => (
              <TicketCard key={t._id} ticket={t} />
            ))}
          </div>
        )}
      </section>

      {/* Popular routes (decorative) */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-4 text-2xl font-bold">Popular Routes</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            "Dhaka → Chittagong",
            "Dhaka → Sylhet",
            "Dhaka → Rajshahi",
            "Barishal → Dhaka",
            "Dhaka → Khulna",
            "Chittagong → Cox's Bazar",
            "Dhaka → Rangpur",
            "Sylhet → Dhaka",
          ].map((r) => (
            <Link
              key={r}
              to={`/tickets?from=${encodeURIComponent(r.split(" → ")[0])}&to=${encodeURIComponent(r.split(" → ")[1])}`}
              className="card flex items-center justify-between p-4 hover:border-brand-500"
            >
              <span className="font-medium">{r}</span>
              <FaArrowRight className="text-brand-600" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
