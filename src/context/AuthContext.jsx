import { createContext, useContext, useState, useEffect } from "react";

// Step 1 — create the whiteboard
// This is an empty whiteboard right now — no data yet
const AuthContext = createContext();

// Step 2 — create the provider
// This component WRAPS your entire app
// Anything inside it can read from the whiteboard
export const AuthProvider = ({ children }) => {

  // These two pieces of state live on the whiteboard
  // user  → the logged in user's info (name, email, id)
  // token → the JWT token
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);

  // When the app first loads, check if a token already exists in localStorage
  // This is what keeps the user logged in after page refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser  = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []); // empty [] means this runs once when app loads

  // This function is called after successful login or register
  // It saves token + user both in state AND in localStorage
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // This function is called when user clicks logout
  // It clears everything from state AND from localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Everything we put in "value" becomes available to any component
  // that uses this context
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Step 3 — a custom hook for easy access
// Instead of importing AuthContext everywhere, components just call useAuth()
export const useAuth = () => useContext(AuthContext);