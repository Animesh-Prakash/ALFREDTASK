import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");

    if (token && userEmail) {
      console.log("Token found:", token);
      console.log("User Email found:", userEmail);

      setIsAuthenticated(true);
      setEmail(userEmail);
    }
  }, []);

  // Debugging: Log state after it updates
 
  return (
    <AuthContext.Provider value={{ isAuthenticated, email, setEmail, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
