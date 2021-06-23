import React, { useContext, useState } from "react";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [table, setTable] = useState({});
  const [gapi, setGapi] = useState();
  const [googleAuth, setGoogleAuth] = useState();

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    gapi,
    setGapi,
    table,
    setTable,
    googleAuth,
    setGoogleAuth,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
