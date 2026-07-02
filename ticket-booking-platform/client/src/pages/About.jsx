export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">About TicketBari</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        TicketBari is a full-featured online ticket booking platform that lets travellers
        discover and book bus, train, launch, and flight tickets across Bangladesh. The platform
        connects three user roles — Travellers (Users), Vendors, and an Admin — through a single
        secure dashboard.
      </p>

      <h2 className="mt-8 text-2xl font-bold">Our mission</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        To make travel planning simple, transparent and affordable for everyone. We work directly
        with vendors to bring verified tickets to one place — no middlemen, no hidden fees.
      </p>

      <h2 className="mt-8 text-2xl font-bold">Tech stack</h2>
      <ul className="mt-2 list-disc pl-6 text-slate-600 dark:text-slate-300">
        <li>MongoDB · Express · React · Node.js (MERN)</li>
        <li>JWT authentication with role-based access control</li>
        <li>Stripe payment integration</li>
        <li>imgbb image hosting</li>
        <li>Tailwind CSS + Recharts + Swiper.js</li>
      </ul>
    </div>
  );
}
