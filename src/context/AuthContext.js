import React, { useContext, useState } from "react";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const value = { isLoggedIn, setIsLoggedIn };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
