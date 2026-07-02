import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Contact() {
  const { register, handleSubmit, reset } = useForm();
  function onSubmit() {
    toast.success("Thanks! Our team will get back to you within 24 hours.");
    reset();
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">Contact us</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Questions, partnership ideas or support requests — drop us a line.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="card p-4">
          <h3 className="font-semibold">Email</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">support@ticketbari.test</p>
        </div>
        <div className="card p-4">
          <h3 className="font-semibold">Phone</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">+880 1234 567890</p>
        </div>
        <div className="card p-4">
          <h3 className="font-semibold">Address</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Dhaka, Bangladesh</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 space-y-4 p-6">
        <div>
          <label className="label">Your name</label>
          <input className="input" {...register("name", { required: true })} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" {...register("email", { required: true })} />
        </div>
        <div>
          <label className="label">Message</label>
          <textarea rows={4} className="input" {...register("message", { required: true })} />
        </div>
        <button type="submit" className="btn-primary">Send message</button>
      </form>
    </div>
  );
}
