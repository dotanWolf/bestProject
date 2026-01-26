import React, { createContext, useState, useEffect, useContext } from "react";
import { getToken, getUserId } from "../tokenUtil"; 

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const IP = process.env.EXPO_PUBLIC_IP;

  // This function fetches the user. 
  const refreshUser = async () => {
    try {
      const token = await getToken();
      const userId = await getUserId();

      if (token && userId) {
        const response = await fetch(`http://${IP}:8080/api/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      }
    } catch (error) {
      console.error("Context: Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch on app start
  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to use the user data easily
export const useUser = () => useContext(UserContext);