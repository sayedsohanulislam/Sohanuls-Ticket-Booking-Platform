import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa6";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register: registerFn, googleLogin } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  async function onSubmit(values) {
    try {
      const user = await registerFn({ name: values.name, email: values.email, password: values.password });
      toast.success(`Welcome, ${user.name}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  }

  const realGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await googleLogin({ token: tokenResponse.access_token });
        toast.success("Logged in with Google successfully!");
        navigate("/");
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
        toast.success("Registered with Google (demo fallback)");
        navigate("/");
      } catch (err) {
        toast.error(err.response?.data?.message || "Google registration failed");
      }
    } else {
      realGoogleLogin();
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Join TicketBari and start booking trips today.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              className="input"
              placeholder="Your name"
              {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 characters" } })}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
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
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>
          <div>
            <label className="label">Confirm password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              {...register("confirm", { required: "Please confirm password", validate: (v) => v === password || "Passwords do not match" })}
            />
            {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm.message}</p>}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Register"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /> OR <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <button onClick={handleGoogle} className="btn-secondary w-full">
          <FaGoogle /> Continue with Google
        </button>

        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
