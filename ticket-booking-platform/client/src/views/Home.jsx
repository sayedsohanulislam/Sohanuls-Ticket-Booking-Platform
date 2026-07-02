import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import {
  FaArrowRight,
  FaBus,
  FaTrain,
  FaPlane,
  FaShip,
  FaShieldHalved,
  FaHeadset,
  FaWallet,
  FaLocationDot,
} from "react-icons/fa6";
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

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const [advertised, setAdvertised] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const navigate = useNavigate();

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchFrom && !searchTo) return;
    navigate(`/tickets?from=${encodeURIComponent(searchFrom)}&to=${encodeURIComponent(searchTo)}`);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Hero slider with Floating Search Bar */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="h-[420px] md:h-[500px]"
        >
          {slides.map((s, i) => (
            <SwiperSlide key={i}>
              <div className={`flex h-full items-center bg-gradient-to-br ${s.bg} px-6 text-white md:px-16`}>
                <div className="max-w-2xl mb-12 md:mb-0">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4"
                  >
                    {s.icon}
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-extrabold leading-tight md:text-5xl"
                  >
                    {s.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    transition={{ delay: 0.4 }}
                    className="mt-3 text-base md:text-lg"
                  >
                    {s.desc}
                  </motion.p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Floating Search Bar */}
        <div className="absolute left-1/2 bottom-0 z-10 w-full max-w-4xl -translate-x-1/2 translate-y-1/2 px-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-2xl dark:bg-slate-900 md:flex-row md:items-center"
          >
            <div className="relative flex-1">
              <FaLocationDot className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="From (e.g. Dhaka)"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                className="input pl-10 border-slate-200 dark:border-slate-800"
              />
            </div>
            <div className="relative flex-1">
              <FaLocationDot className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="To (e.g. Chittagong)"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                className="input pl-10 border-slate-200 dark:border-slate-800"
              />
            </div>
            <button type="submit" className="btn-primary py-3 md:px-8">
              Find Tickets
            </button>
          </form>
        </div>
      </div>

      <div className="h-20 md:h-12" />

      {/* Why choose us */}
      <motion.section variants={itemVariants} className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold md:text-3xl">Why choose TicketBari?</h2>
        <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
          One platform for every journey across bus, train, launch and flight.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: <FaShieldHalved />,
              title: "Secure payments",
              desc: "All payments are processed through Stripe with industry-standard encryption.",
            },
            {
              icon: <FaHeadset />,
              title: "24/7 support",
              desc: "Our support team is available round-the-clock for any booking-related issues.",
            },
            {
              icon: <FaWallet />,
              title: "Best prices",
              desc: "We work directly with vendors to bring you the most competitive prices.",
            },
          ].map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="card p-6 text-center cursor-default"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-2xl text-brand-700 dark:bg-slate-800 dark:text-brand-300">
                {c.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={itemVariants}
        className="mx-auto max-w-7xl px-4 py-12 bg-gradient-to-r from-brand-600/10 via-indigo-600/5 to-transparent rounded-3xl my-8 cursor-default"
      >
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
          {[
            { val: "250K+", label: "Happy Customers" },
            { val: "500+", label: "Active Routes" },
            { val: "99.9%", label: "On-time Departure" },
            { val: "4.9/5", label: "Average Review" },
          ].map((st, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }} className="p-4">
              <div className="text-3xl font-extrabold text-brand-700 dark:text-brand-400 md:text-4xl">
                {st.val}
              </div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
                {st.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Tickets (admin-curated) */}
      <motion.section variants={itemVariants} className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Tickets</h2>
          <Link
            to="/tickets"
            className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
          >
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
              <motion.div key={t._id} whileHover={{ y: -5 }}>
                <TicketCard ticket={t} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Latest tickets */}
      <motion.section variants={itemVariants} className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-4 text-2xl font-bold">Latest Tickets</h2>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((t) => (
              <motion.div key={t._id} whileHover={{ y: -5 }}>
                <TicketCard ticket={t} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Testimonials */}
      <motion.section variants={itemVariants} className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold md:text-3xl">What Our Travelers Say</h2>
        <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
          Real stories from travelers who book through TicketBari daily.
        </p>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="mt-8 h-[220px]"
        >
          {[
            {
              name: "Sohanul Islam",
              role: "Software Engineer",
              comment:
                "TicketBari made my travel to Chittagong so easy. The seat selector for buses is exactly what was missing on other sites!",
              rating: "⭐⭐⭐⭐⭐",
            },
            {
              name: "Anika Tahseen",
              role: "UI Designer",
              comment:
                "The dark mode is beautiful and the Stripe checkout was completed in under 10 seconds. Highly recommend the PDF ticket print!",
              rating: "⭐⭐⭐⭐⭐",
            },
            {
              name: "Shihab Atahar",
              role: "Business Lead",
              comment:
                "Outstanding dashboard experience. As a vendor, adding my flights and managing client booking requests is seamless.",
              rating: "⭐⭐⭐⭐⭐",
            },
          ].map((t, i) => (
            <SwiperSlide key={i}>
              <div className="mx-auto max-w-2xl text-center px-4">
                <div className="text-brand-600 text-xl font-bold mb-2">{t.rating}</div>
                <p className="text-base md:text-lg italic text-slate-700 dark:text-slate-300">
                  "{t.comment}"
                </p>
                <h4 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{t.name}</h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">{t.role}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.section>

      {/* Popular routes (decorative) */}
      <motion.section variants={itemVariants} className="mx-auto max-w-7xl px-4 py-12">
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
            <motion.div key={r} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
              <Link
                to={`/tickets?from=${encodeURIComponent(r.split(" → ")[0])}&to=${encodeURIComponent(r.split(" → ")[1])}`}
                className="card flex items-center justify-between p-4 hover:border-brand-500"
              >
                <span className="font-medium text-sm md:text-base">{r}</span>
                <FaArrowRight className="text-brand-600" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
