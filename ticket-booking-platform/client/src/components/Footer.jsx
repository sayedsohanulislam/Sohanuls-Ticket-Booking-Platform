import { Link } from "react-router-dom";
import { FaBus, FaFacebookF, FaXTwitter, FaInstagram, FaCcStripe } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Column 1 — Brand */}
        <div>
          <div className="flex items-center gap-2 text-xl font-extrabold text-brand-700 dark:text-brand-300">
            <FaBus /> <span>TicketBari</span>
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Book bus, train, launch & flight tickets easily. One platform for every journey.
          </p>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <h4 className="mb-3 font-semibold text-slate-800 dark:text-slate-100">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link to="/" className="hover:text-brand-600">Home</Link></li>
            <li><Link to="/tickets" className="hover:text-brand-600">All Tickets</Link></li>
            <li><Link to="/contact" className="hover:text-brand-600">Contact Us</Link></li>
            <li><Link to="/about" className="hover:text-brand-600">About</Link></li>
          </ul>
        </div>

        {/* Column 3 — Contact */}
        <div>
          <h4 className="mb-3 font-semibold text-slate-800 dark:text-slate-100">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li>Email: support@ticketbari.test</li>
            <li>Phone: +880 1234 567890</li>
            <li className="flex items-center gap-3 pt-2">
              <a href="https://facebook.com" aria-label="Facebook" className="hover:text-brand-600"><FaFacebookF /></a>
              <a href="https://x.com" aria-label="X" className="hover:text-brand-600"><FaXTwitter /></a>
              <a href="https://instagram.com" aria-label="Instagram" className="hover:text-brand-600"><FaInstagram /></a>
            </li>
          </ul>
        </div>

        {/* Column 4 — Payment */}
        <div>
          <h4 className="mb-3 font-semibold text-slate-800 dark:text-slate-100">Payment Methods</h4>
          <div className="flex items-center gap-3 text-slate-500">
            <FaCcStripe className="h-8 w-8" />
            <span className="text-sm">Secured by Stripe</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © 2025 TicketBari. All rights reserved.
      </div>
    </footer>
  );
}
