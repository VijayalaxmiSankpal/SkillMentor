import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "../services/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    localStorage.removeItem("skillmentor_token");
    localStorage.removeItem("skillmentor_user");
    setUser(null);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("skillmentor_user");
    const token = localStorage.getItem("skillmentor_token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        clearAuth();
      }
    }

    setLoading(false);
  }, [clearAuth]);

  const login = useCallback(async (email, password) => {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    const payload = response.data?.data;

    const loggedInUser = payload?.user;
    const accessToken = payload?.accessToken;

    if (!loggedInUser || !accessToken) {
      throw new Error("Invalid login response from server");
    }

    localStorage.setItem("skillmentor_token", accessToken);
    localStorage.setItem("skillmentor_user", JSON.stringify(loggedInUser));

    setUser(loggedInUser);

    return payload;
  }, []);

  const signup = useCallback(async (formData) => {
    const response = await axiosInstance.post("/auth/signup", formData);
    return response.data;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    window.location.href = "/login";
  }, [clearAuth]);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("skillmentor_user", JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
};

export default AuthContext;