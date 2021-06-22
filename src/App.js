import React from "react";
import "./App.css";
import Login from "./Login";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import About from "./About";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <AuthProvider>
            <Route exact path="/" component={Login} />

            <Route path="/about" component={About} />

            <div className="aboutLink">
              <Link to="/about">Privacy Policy</Link>
            </div>
          </AuthProvider>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
