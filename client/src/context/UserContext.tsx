import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Initial user data
const defaultUser = {
  id: 1,
  username: "janderson",
  fullName: "John Anderson",
  email: "john@example.com",
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
  preferences: {}
};

// Define the user context interface
interface UserContextType {
  user: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    profileImage?: string;
    preferences?: Record<string, any>;
  } | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (preferences: Record<string, any>) => Promise<void>;
}

// Create the context
const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  logout: () => {},
  updatePreferences: async () => {}
});

// Hook for consuming the context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(defaultUser);
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, we'd check for auth token on initial load
  // For this demo, we'll just load the default user

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/login", { username, password });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // In a real app, this would clear auth tokens
    setUser(defaultUser);
  };

  const updatePreferences = async (preferences: Record<string, any>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest("PATCH", `/api/users/${user.id}/preferences`, preferences);
      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update preferences:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout, updatePreferences }}>
      {children}
    </UserContext.Provider>
  );
};
