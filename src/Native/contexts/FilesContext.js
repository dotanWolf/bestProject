import React, { createContext, useContext, useState, useCallback } from 'react';
import { getToken, getUserId } from '../tokenUtil';

const FilesContext = createContext();

export function FilesProvider({ children }) {
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const IP = process.env.EXPO_PUBLIC_IP;

  // Initialize token and userId
  const initialize = useCallback(async () => {
    const userToken = await getToken();
    const userId = await getUserId();
    setToken(userToken);
    setCurrentUserId(userId);
    return { token: userToken, userId };
  }, []);

  // Fetch all files once
  const refreshFiles = useCallback(async () => {
    let userToken = token;
    
    if (!userToken) {
      const result = await initialize();
      userToken = result.token;
    }
    
    if (!userToken) return;

    console.log("🔄 Refreshing all files from server...");
    setLoading(true);
    
    try {
      const [ownedResponse, sharedResponse] = await Promise.all([
        fetch(`http://${IP}:8080/api/files`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`,
          },
        }),
        fetch(`http://${IP}:8080/api/files/permissions`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`,
          },
        })
      ]);

      if (ownedResponse.ok && sharedResponse.ok) {
        const ownedData = await ownedResponse.json();
        const sharedData = await sharedResponse.json();
        
        const combined = [...ownedData, ...sharedData];
        console.log("✅ Files loaded:", combined.length);
        setAllFiles(combined);
      }
    } catch (error) {
      console.error("❌ Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  }, [IP, token, initialize]);

  return (
    <FilesContext.Provider value={{ 
      allFiles, 
      loading, 
      refreshFiles, 
      token,
      currentUserId,
      initialize
    }}>
      {children}
    </FilesContext.Provider>
  );
}

export const useFiles = () => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error('useFiles must be used within FilesProvider');
  }
  return context;
};