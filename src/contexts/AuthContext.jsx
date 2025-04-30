import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "@api/auth";
import {
  getToken,
  setUserData,
  getUserData,
  removeToken,
  removeUserData,
} from "@utils/storage";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      if (getToken()) {
        try {
          const storedUser = getUserData();
          if (storedUser) {
            setUser(storedUser);
          }

          const userData = await authApi.checkAuth();
          setUser(userData);
          setUserData(userData);
        } catch (error) {
          console.error("Authentication error:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(
    async (credentials) => {
      try {
        setLoading(true);
        await authApi.login(credentials);
        const userData = await authApi.checkAuth();
        setUser(userData);
        setUserData(userData);
        toast.success("Login successful");
        navigate("/dashboard");
        return { success: true };
      } catch (error) {
        const message = error.response?.data?.detail || "Login failed";
        toast.error(message);
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const register = useCallback(
    async (userData) => {
      try {
        setLoading(true);
        await authApi.register(userData);
        toast.success("Registration successful. Please log in.");
        navigate("/login");
        return { success: true };
      } catch (error) {
        const message = error.response?.data?.detail || "Registration failed";
        toast.error(message);
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    removeToken();
    removeUserData();
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  }, [navigate]);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
