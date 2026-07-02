import { createContext, useContext, useEffect, useState } from "react";
import { api, setSession, clearSession, getStoredUser, getStoredToken } from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  // On mount: if we have a token, refresh /me so role changes propagate
  useEffect(() => {
    let active = true;
    async function bootstrap() {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        if (active) {
          setUser(data.user);
          setSession({ token, ...data.user });
        }
      } catch {
        clearSession();
        setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  async function login(payload) {
    const { data } = await api.post("/auth/login", payload);
    setUser(data.user);
    setSession(data.user);
    return data.user;
  }

  async function register(payload) {
    const { data } = await api.post("/auth/register", payload);
    setUser(data.user);
    setSession(data.user);
    return data.user;
  }

  async function googleLogin(payload) {
    const { data } = await api.post("/auth/google", payload);
    setUser(data.user);
    setSession(data.user);
    return data.user;
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  function refreshUser(updated) {
    const merged = { ...user, ...updated, token: getStoredToken() };
    setUser(merged);
    setSession(merged);
  }

  const value = {
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    refreshUser,
    isAuthed: !!user,
    isAdmin: user?.role === "admin",
    isVendor: user?.role === "vendor",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
