import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(values) {
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  }

  // Demo Google flow — in production, wire up @react-oauth/google
  async function handleGoogle() {
    try {
      // Placeholder payload; real Google ID token would be sent here
      await googleLogin({
        email: "demo.google@ticketbari.test",
        name: "Google Demo User",
        providerId: "demo-google-001",
        avatar: "",
      });
      toast.success("Logged in with Google (demo)");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Google login failed");
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Login to TicketBari</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Welcome back! Please enter your credentials.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in…" : "Login"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /> OR <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <button onClick={handleGoogle} className="btn-secondary w-full">
          <FaGoogle /> Continue with Google
        </button>

        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
            Register here
          </Link>
        </p>
      </div>

      <div className="card mt-4 bg-slate-50 p-4 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        <strong>Demo accounts</strong>
        <div>Admin   : admin@ticketbari.test / Admin123!</div>
        <div>Vendor  : vendor@ticketbari.test / Vendor123!</div>
        <div>User    : user@ticketbari.test / User123!</div>
      </div>
    </div>
  );
}
