import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { api, uploadToImgbb } from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";

const PERKS = ["AC", "WiFi", "Breakfast", "Lunch", "Snacks", "Cabin", "Charging Port", "Blanket"];

export default function AddTicket() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      from: "",
      to: "",
      transportType: "bus",
      price: "",
      quantity: "",
      departureDate: "",
      perks: [],
      image: "",
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
      toast.error(err.message || "Image upload failed", { id: "img" });
    }
  }

  async function onSubmit(values) {
    try {
      await api.post("/tickets", {
        ...values,
        price: Number(values.price),
        quantity: Number(values.quantity),
      });
      toast.success("Ticket added — pending admin verification");
      navigate("/dashboard/my-tickets");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add ticket");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Add Ticket</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Fill in the details below. Tickets are saved with verification status <strong>pending</strong>.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
        <div>
          <label className="label">Ticket title</label>
          <input className="input" {...register("title", { required: true })} placeholder="e.g. Dhaka → Chittagong AC Bus" />
        </div>
        <div>
          <label className="label">Transport type</label>
          <select className="input" {...register("transportType", { required: true })}>
            <option value="bus">Bus</option>
            <option value="train">Train</option>
            <option value="launch">Launch</option>
            <option value="plane">Plane</option>
          </select>
        </div>
        <div>
          <label className="label">From</label>
          <input className="input" {...register("from", { required: true })} placeholder="e.g. Dhaka" />
        </div>
        <div>
          <label className="label">To</label>
          <input className="input" {...register("to", { required: true })} placeholder="e.g. Chittagong" />
        </div>
        <div>
          <label className="label">Price (per unit, ৳)</label>
          <input type="number" min="0" className="input" {...register("price", { required: true })} placeholder="1200" />
        </div>
        <div>
          <label className="label">Ticket quantity</label>
          <input type="number" min="1" className="input" {...register("quantity", { required: true })} placeholder="30" />
        </div>
        <div className="md:col-span-2">
          <label className="label">Departure date & time</label>
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
          {image && (
            <img src={image} alt="preview" className="mt-2 h-32 rounded-md object-cover" />
          )}
          {!image && (
            <div className="mt-2 flex h-32 items-center justify-center rounded-md border border-dashed border-slate-300 text-slate-400 dark:border-slate-700">
              <FaCloudUploadAlt className="mr-2" /> Upload an image (imgbb)
            </div>
          )}
        </div>

        <div>
          <label className="label">Vendor name</label>
          <input className="input" value={user?.name || ""} readOnly />
        </div>
        <div>
          <label className="label">Vendor email</label>
          <input className="input" value={user?.email || ""} readOnly />
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Adding…" : "Add Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}
