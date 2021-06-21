import React, { useState, useEffect } from "react";
import { loadGoogleScript } from "./util/GoogleLogin";
import { useAuth } from "./context/AuthContext";
import "./Login.css";
import { Button } from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";
import Import from "./Import";

export default function Login() {
  const {
    isLoggedIn,
    setIsLoggedIn,
    gapi,
    setGapi,
    googleAuth,
    setGoogleAuth,
  } = useAuth();
  const [name, setName] = useState("");

  const onSuccess = (googleUser) => {
    setIsLoggedIn(true);
    const profile = googleUser.getBasicProfile();
    setName(profile.getName());
  };

  const onFailure = () => {
    setIsLoggedIn(false);
  };

  const logOut = () => {
    (async () => {
      await googleAuth.signOut();
      setIsLoggedIn(false);
      renderSigninButton(gapi);
    })();
  };
  const renderSigninButton = (_gapi) => {
    _gapi.signin2.render("google-signin", {
      scope: "profile email",
      width: 200,
      height: 40,
      longtitle: true,
      theme: "dark",
      onsuccess: onSuccess,
      onfailure: onFailure,
    });
  };

  useEffect(() => {
    // Window.gapi is available at this point
    window.onGoogleScriptLoad = () => {
      const _gapi = window.gapi;
      setGapi(_gapi);

      _gapi.load("client:auth2", () => {
        (async () => {
          await _gapi.client.init({
            apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
            clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            scope: "https://www.googleapis.com/auth/calendar",
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            ],
          });
          const _googleAuth = await _gapi.auth2.getAuthInstance();
          setGoogleAuth(_googleAuth);
          renderSigninButton(_gapi);
        })();
      });
    };

    // Ensure everything is set before loading the script
    loadGoogleScript();
  }, []);

  return (
    <div className="login">
      <h1>NTU Calendar</h1>
      <div className="loginDisplay">
        <p>{isLoggedIn && googleAuth && `Logged in as ${name}`}</p>
        {isLoggedIn ? (
          <Button color="secondary" endIcon={<ExitToApp />} onClick={logOut}>
            Logout
          </Button>
        ) : (
          <div id="google-signin"></div>
        )}
      </div>
      <Import />
    </div>
  );
}
