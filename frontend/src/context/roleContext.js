import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; // Corrected import for jwt-decode

const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role || null);
        setUserId(decodedToken._id || null); // Use `_id` from the token
      } catch (error) {
        console.error("Error decoding token:", error);
        setRole(null);
        setUserId(null);
      }
    }
  }, []);

  const setUserRole = (newRole, newUserId) => {
    setRole(newRole);
    setUserId(newUserId);
    Cookies.set("userRole", newRole, { expires: 7 });
    Cookies.set("userId", newUserId, { expires: 7 });
  };

  const clearUserRole = () => {
    setRole(null);
    setUserId(null);
    Cookies.remove("userRole");
    Cookies.remove("userId");
    Cookies.remove("token");
  };

  return (
    <RoleContext.Provider value={{ role, userId, setUserRole, clearUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  return useContext(RoleContext);
};
