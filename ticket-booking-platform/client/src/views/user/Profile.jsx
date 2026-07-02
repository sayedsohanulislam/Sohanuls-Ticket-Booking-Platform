import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { api } from "../../api/axios.js";

export default function UserProfile() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: user?.name || "", avatar: user?.avatar || "" },
  });

  async function onSubmit(values) {
    try {
      const { data } = await api.put("/users/me", values);
      refreshUser(data.user);
      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">My Profile</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Manage your account information.
      </p>

      <div className="card mt-6 p-6">
        <div className="flex items-center gap-4">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl text-brand-700 dark:bg-slate-800 dark:text-brand-300">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            <span className="badge bg-brand-100 text-brand-800 mt-1 capitalize">{user?.role}</span>
          </div>
        </div>

        {!editing ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Full name" value={user?.name} />
            <Field label="Email" value={user?.email} />
            <Field label="Role" value={user?.role} capitalize />
            <Field label="Account status" value={user?.isFraud ? "Flagged" : "Active"} />
            <Field label="Member since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"} />
            <Field label="Last updated" value={user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "—"} />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="label">Name</label>
              <input className="input" {...register("name", { required: true })} />
            </div>
            <div>
              <label className="label">Avatar URL</label>
              <input className="input" {...register("avatar")} placeholder="https://…" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Save</button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  reset();
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {!editing && (
          <button className="btn-secondary mt-6" onClick={() => setEditing(true)}>
            Edit profile
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, capitalize }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`mt-1 font-medium ${capitalize ? "capitalize" : ""}`}>{value || "—"}</div>
    </div>
  );
}
