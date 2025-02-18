import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");

    if (token && userEmail) {

      setIsAuthenticated(true);
      setEmail(userEmail);
    }
  }, []);

 
  return (
    <AuthContext.Provider value={{ isAuthenticated, email, setEmail, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
