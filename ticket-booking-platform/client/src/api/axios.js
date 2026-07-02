import axios from "axios";

const baseURL =
  (typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_VITE_API_URL || process.env.VITE_API_URL) : undefined) || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  withCredentials: false,
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("tb_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-handle 401 → clear session and bounce to /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // don't redirect on auth/me — that would cause loops on app load
      if (!err.config.url.includes("/auth/")) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("tb_token");
          localStorage.removeItem("tb_user");
        }
      }
    }
    return Promise.reject(err);
  }
);

// Convenience helpers
export const setSession = ({ token, ...user }) => {
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("tb_token", token);
    if (user) localStorage.setItem("tb_user", JSON.stringify(user));
  }
};

export const clearSession = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("tb_token");
    localStorage.removeItem("tb_user");
  }
};

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("tb_user") || "null");
  } catch {
    return null;
  }
};

export const getStoredToken = () => typeof window !== "undefined" ? localStorage.getItem("tb_token") : null;

// ====== Image upload helper (imgbb) ======
export async function uploadToImgbb(file) {
  const apiKey = (typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_VITE_IMGBB_API_KEY || process.env.VITE_IMGBB_API_KEY) : undefined);
  if (!apiKey) {
    throw new Error("imgbb API key is not configured (VITE_IMGBB_API_KEY)");
  }
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    { method: "POST", body: form }
  );
  const data = await res.json();
  if (!data?.data?.url) {
    throw new Error("Image upload failed");
  }
  return data.data.url;
}
