import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUserShield, FaStore, FaBan, FaCheckCircle } from "react-icons/fa6";
import { api } from "../../api/axios.js";
import Spinner from "../../components/Spinner.jsx";

export default function ManageUsers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      const { data } = await api.get("/users");
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function changeRole(id, role) {
    try {
      await api.patch(`/users/${id}/role`, { role });
      toast.success(`User role changed to ${role}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  }

  async function toggleFraud(user) {
    try {
      await api.patch(`/users/${user._id}/fraud`, {});
      toast.success(user.isFraud ? "Vendor un-flagged" : "Vendor marked as fraud");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Promote users to admin/vendor, or mark vendors as fraud.
      </p>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u._id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 capitalize">
                  <span className="badge bg-brand-100 text-brand-800">{u.role}</span>
                </td>
                <td className="px-4 py-3">
                  {u.isFraud ? (
                    <span className="badge-rejected">fraud</span>
                  ) : (
                    <span className="badge-paid">active</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <button
                      className="btn-secondary px-3 py-1"
                      disabled={u.role === "admin"}
                      onClick={() => changeRole(u._id, "admin")}
                    >
                      <FaUserShield /> Make Admin
                    </button>
                    <button
                      className="btn-secondary px-3 py-1"
                      disabled={u.role === "vendor"}
                      onClick={() => changeRole(u._id, "vendor")}
                    >
                      <FaStore /> Make Vendor
                    </button>
                    {u.role === "vendor" && (
                      <button
                        className={u.isFraud ? "btn-primary px-3 py-1" : "btn-danger px-3 py-1"}
                        onClick={() => toggleFraud(u)}
                      >
                        {u.isFraud ? (
                          <><FaCheckCircle /> Un-flag</>
                        ) : (
                          <><FaBan /> Mark as Fraud</>
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
