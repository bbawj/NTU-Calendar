import React, { useState, useEffect } from "react";
import { loadGoogleScript } from "./util/GoogleLogin";
import { useAuth } from "./context/AuthContext";
import "./Login.css";

export default function Login() {
  const [googleAuth, setGoogleAuth] = useState();
  const { isLoggedIn, setIsLoggedIn, gapi, setGapi } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState();

  const onSuccess = (googleUser) => {
    // (Ref. 7)
    setIsLoggedIn(true);
    const profile = googleUser.getBasicProfile();
    setName(profile.getName());
    setEmail(profile.getEmail());
    setImageUrl(profile.getImageUrl());
  };

  const onFailure = () => {
    setIsLoggedIn(false);
  };

  const logOut = () => {
    // (Ref. 8)
    (async () => {
      await googleAuth.signOut();
      setIsLoggedIn(false);
      renderSigninButton(gapi);
    })();
  };

  const renderSigninButton = (_gapi) => {
    // (Ref. 6)
    _gapi.signin2.render("google-signin", {
      scope: "profile email",
      width: 240,
      height: 50,
      longtitle: true,
      theme: "dark",
      onsuccess: onSuccess,
      onfailure: onFailure,
    });
  };

  useEffect(() => {
    // Window.gapi is available at this point
    window.onGoogleScriptLoad = () => {
      // (Ref. 1)

      const _gapi = window.gapi; // (Ref. 2)
      setGapi(_gapi);

      _gapi.load("client:auth2", () => {
        // (Ref. 3)
        (async () => {
          await _gapi.client.init({
            // (Ref. 4)
            apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
            clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            scope: "https://www.googleapis.com/auth/calendar",
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            ],
          });
          const _googleAuth = await _gapi.auth2.getAuthInstance();
          setGoogleAuth(_googleAuth); // (Ref. 5)
          renderSigninButton(_gapi); // (Ref. 6)
        })();
      });
    };

    // Ensure everything is set before loading the script
    loadGoogleScript(); // (Ref. 9)
  }, []);

  return (
    <div className="login">
      <h1>NTU Calendar</h1>
      {isLoggedIn ? (
        <button onClick={logOut}>Logout</button>
      ) : (
        <div id="google-signin"></div>
      )}
      <p>{googleAuth && `Logged in as ${googleAuth.currentUser.get()}`}</p>
    </div>
  );
}
