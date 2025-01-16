import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie"; 

const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Check if the role exists in the cookie on initial load
    const storedRole = Cookies.get("userRole");
    if (storedRole) {
      setRole(storedRole); // Set the role from cookie
    }
  }, []);

  // Function to update the user's role in state and cookie
  const setUserRole = (newRole) => {
    setRole(newRole);
    Cookies.set("userRole", newRole, { expires: 7 }); // Store the role in cookie for 7 days
  };

  // Function to clear the user's role from state and cookie
  const clearUserRole = () => {
    setRole(null);
    Cookies.remove("userRole"); // Remove the role cookie
  };

  return (
    <RoleContext.Provider value={{ role, setUserRole, clearUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook to access the role context
export const useRole = () => {
  return useContext(RoleContext);
};
