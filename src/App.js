import React from "react";
import "./App.css";
import Login from "./Login";
import { AuthProvider } from "./context/AuthContext";
import Import from "./Import";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Login />
        <Import />
      </AuthProvider>
    </div>
  );
}

export default App;
