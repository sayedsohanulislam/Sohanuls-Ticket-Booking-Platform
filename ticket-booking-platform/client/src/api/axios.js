import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  withCredentials: false,
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tb_token");
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
        localStorage.removeItem("tb_token");
        localStorage.removeItem("tb_user");
      }
    }
    return Promise.reject(err);
  }
);

// Convenience helpers
export const setSession = ({ token, ...user }) => {
  if (token) localStorage.setItem("tb_token", token);
  if (user) localStorage.setItem("tb_user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("tb_token");
  localStorage.removeItem("tb_user");
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("tb_user") || "null");
  } catch {
    return null;
  }
};

export const getStoredToken = () => localStorage.getItem("tb_token");

// ====== Image upload helper (imgbb) ======
export async function uploadToImgbb(file) {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
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
