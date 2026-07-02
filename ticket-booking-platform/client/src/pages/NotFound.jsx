import { Link } from "react-router-dom";
import { FaBus } from "react-icons/fa6";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <div className="text-7xl text-brand-600">
        <FaBus />
      </div>
      <h1 className="mt-6 text-5xl font-extrabold">404</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        The page you are looking for has departed without you.
      </p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}
