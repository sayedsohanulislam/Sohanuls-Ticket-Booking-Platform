import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa6";
import { api, uploadToImgbb } from "../../api/axios.js";
import Spinner from "../../components/Spinner.jsx";
import { useForm } from "react-hook-form";

const PERKS = ["AC", "WiFi", "Breakfast", "Lunch", "Snacks", "Cabin", "Charging Port", "Blanket"];

function StatusBadge({ status }) {
  const cls = {
    pending: "badge-pending",
    approved: "badge-paid",
    rejected: "badge-rejected",
  }[status];
  return <span className={cls}>{status}</span>;
}

export default function MyTickets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  async function fetchTickets() {
    try {
      const { data } = await api.get("/tickets/vendor/mine");
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this ticket?")) return;
    try {
      await api.delete(`/tickets/${id}`);
      toast.success("Ticket deleted");
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Added Tickets</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Manage all tickets you have added. Update or delete anytime (except rejected).
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/dashboard/add-ticket")}>
          <FaPlus /> Add new
        </button>
      </div>

      {items.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No tickets yet. Click "Add new" to create your first ticket.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <div key={t._id} className="card overflow-hidden">
              <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800">
                {t.image && <img src={t.image} alt={t.title} className="h-full w-full object-cover" />}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{t.title}</h3>
                  <StatusBadge status={t.verificationStatus} />
                </div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t.from} → {t.to}
                </div>
                <div className="mt-2 text-sm">
                  ৳{t.price.toLocaleString()} × {t.quantity} seats · {t.transportType}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Dep: {new Date(t.departureDate).toLocaleString()}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="btn-secondary flex-1"
                    disabled={t.verificationStatus === "rejected"}
                    onClick={() => setEditing(t)}
                  >
                    <FaEdit /> Update
                  </button>
                  <button
                    className="btn-danger flex-1"
                    disabled={t.verificationStatus === "rejected"}
                    onClick={() => handleDelete(t._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditModal
          ticket={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            fetchTickets();
          }}
        />
      )}
    </div>
  );
}

function EditModal({ ticket, onClose, onSaved }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: ticket.title,
      from: ticket.from,
      to: ticket.to,
      transportType: ticket.transportType,
      price: ticket.price,
      quantity: ticket.quantity,
      departureDate: new Date(ticket.departureDate).toISOString().slice(0, 16),
      perks: ticket.perks || [],
      image: ticket.image,
    },
  });

  const perks = watch("perks") || [];
  const image = watch("image");

  function togglePerk(p) {
    const next = perks.includes(p) ? perks.filter((x) => x !== p) : [...perks, p];
    setValue("perks", next);
  }

  async function onImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading("Uploading image…", { id: "img" });
      const url = await uploadToImgbb(file);
      setValue("image", url);
      toast.success("Image uploaded", { id: "img" });
    } catch (err) {
      toast.error(err.message || "Upload failed", { id: "img" });
    }
  }

  async function onSubmit(values) {
    try {
      await api.put(`/tickets/${ticket._id}`, {
        ...values,
        price: Number(values.price),
        quantity: Number(values.quantity),
      });
      toast.success("Ticket updated");
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">Edit ticket</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label">Title</label>
            <input className="input" {...register("title", { required: true })} />
          </div>
          <div>
            <label className="label">Transport</label>
            <select className="input" {...register("transportType")}>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="launch">Launch</option>
              <option value="plane">Plane</option>
            </select>
          </div>
          <div>
            <label className="label">From</label>
            <input className="input" {...register("from", { required: true })} />
          </div>
          <div>
            <label className="label">To</label>
            <input className="input" {...register("to", { required: true })} />
          </div>
          <div>
            <label className="label">Price</label>
            <input type="number" min="0" className="input" {...register("price", { required: true })} />
          </div>
          <div>
            <label className="label">Quantity</label>
            <input type="number" min="0" className="input" {...register("quantity", { required: true })} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Departure</label>
            <input type="datetime-local" className="input" {...register("departureDate", { required: true })} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Perks</label>
            <div className="flex flex-wrap gap-2">
              {PERKS.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => togglePerk(p)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    perks.includes(p)
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-300"
                      : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="label">Image</label>
            <input type="file" accept="image/*" onChange={onImageChange} className="input" />
            {image && <img src={image} alt="" className="mt-2 h-24 rounded-md object-cover" />}
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
