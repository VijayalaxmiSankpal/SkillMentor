import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../services/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("skillmentor_user");
    const token  = localStorage.getItem("skillmentor_token");
    if (stored && token) {
      try { setUser(JSON.parse(stored)); }
      catch { clearAuth(); }
    }
    setLoading(false);
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("skillmentor_token");
    localStorage.removeItem("skillmentor_user");
    setUser(null);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await axiosInstance.post("/auth/login", { email, password });
    localStorage.setItem("skillmentor_token", data.token);
    localStorage.setItem("skillmentor_user",  JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const signup = useCallback(async (formData) => {
    const { data } = await axiosInstance.post("/auth/register", formData);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    window.location.href = "/login";
  }, []);

  const updateUser = useCallback((updated) => {
    setUser(updated);
    localStorage.setItem("skillmentor_user", JSON.stringify(updated));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export default AuthContext;