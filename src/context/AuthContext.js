import React, { useContext, useState } from "react";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [classInfo, setClassInfo] = useState([]);
  const [gapi, setGapi] = useState();

  const value = {
    classInfo,
    setClassInfo,
    isLoggedIn,
    setIsLoggedIn,
    gapi,
    setGapi,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
