import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { isStaffRole } from "../utils/permissions";

const AuthContext = createContext(null);

const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const clearLegacyAuthStorage = () => {
    sessionStorage.removeItem("admin_token");
    localStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_role");
    localStorage.removeItem("admin_role");
  };

  const refreshAuth = async () => {
    try {
      const response = await axios.post(`${url}/api/user/getuser`, {});
      if (response.data.success && isStaffRole(response.data.data.role)) {
        setRole(response.data.data.role);
        setIsAuthenticated(true);
        return response.data.data;
      }
      setRole("");
      setIsAuthenticated(false);
      return null;
    } catch {
      setRole("");
      setIsAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clearLegacyAuthStorage();
    refreshAuth();
  }, []);

  const logout = async () => {
    try {
      await axios.post(`${url}/api/user/logout`, {});
    } catch (error) {
      console.log(error);
    }
    clearLegacyAuthStorage();
    setRole("");
    setIsAuthenticated(false);
    window.location.href = "/auth?mode=login";
  };

  return (
    <AuthContext.Provider
      value={{ role, loading, isAuthenticated, refreshAuth, logout, url }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
