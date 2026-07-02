import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa6";
import { useGoogleLogin } from "@react-oauth/google";
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

  const realGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await googleLogin({ token: tokenResponse.access_token });
        toast.success("Logged in with Google successfully!");
        navigate(from, { replace: true });
      } catch (err) {
        toast.error(err.response?.data?.message || "Google login failed");
      }
    },
    onError: () => {
      toast.error("Google login failed");
    },
  });

  async function handleGoogle() {
    const clientId = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_VITE_GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID) : undefined;
    if (!clientId || clientId === "your_google_client_id" || clientId === "") {
      try {
        await googleLogin({
          email: "demo.google@ticketbari.test",
          name: "Google Demo User",
          providerId: "demo-google-001",
          avatar: "",
        });
        toast.success("Logged in with Google (demo fallback)");
        navigate(from, { replace: true });
      } catch (err) {
        toast.error(err.response?.data?.message || "Google login failed");
      }
    } else {
      realGoogleLogin();
    }
  }

  const handleQuickLogin = async (role) => {
    let email = "";
    let password = "";
    if (role === "admin") {
      email = "admin@ticketbari.test";
      password = "Admin123!";
    } else if (role === "vendor") {
      email = "vendor@ticketbari.test";
      password = "Vendor123!";
    } else {
      email = "user@ticketbari.test";
      password = "User123!";
    }

    try {
      const user = await login({ email, password });
      toast.success(`Logged in as ${role.toUpperCase()}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

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
        <strong className="block text-center text-slate-700 dark:text-slate-300">Quick Developer Login</strong>
        <div className="mt-3 flex justify-between gap-2">
          <button onClick={() => handleQuickLogin("admin")} className="flex-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-950/40 dark:hover:bg-red-950/70 dark:text-red-300 py-1.5 px-2 text-center font-medium transition-colors">
            Admin
          </button>
          <button onClick={() => handleQuickLogin("vendor")} className="flex-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950/40 dark:hover:bg-amber-950/70 dark:text-amber-300 py-1.5 px-2 text-center font-medium transition-colors">
            Vendor
          </button>
          <button onClick={() => handleQuickLogin("user")} className="flex-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-950/40 dark:hover:bg-blue-950/70 dark:text-blue-300 py-1.5 px-2 text-center font-medium transition-colors">
            User
          </button>
        </div>
      </div>
    </div>
  );
}
