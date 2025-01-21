import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token on init:", decoded);
        const user = JSON.parse(userData);
        console.log("Stored user data:", user);
        setAuth({
          token,
          user: {
            ...decoded,
            ...user,
            is_staff: Boolean(user.is_staff),
            is_superuser: Boolean(user.is_superuser),
            groups: Array.isArray(user.groups) ? user.groups : [],
          },
        });
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      }
    }
  }, []);

  const login = async (token, userData) => {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token on login:", decoded);

      // Combine token claims with user data
      const user = {
        ...decoded,
        ...userData,
        is_staff: Boolean(userData.is_staff),
        is_superuser: Boolean(userData.is_superuser),
        groups: Array.isArray(userData.groups) ? userData.groups : [],
      };

      console.log("Setting auth data:", { token, user });
      setAuth({ token, user });

      // Store user data in localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
