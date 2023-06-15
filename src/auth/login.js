import React, { useState } from "react";
import "./login.css";
import { auth } from "../backend/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login({ onSwitchPage, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setInvalidEmail(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setInvalidPassword(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("user: ", user);
        // alert("Login successful");
        onLogin();
      })
      .catch((error) => {
        console.log("error: ", error);
        if (error.code === "auth/invalid-email") {
          setInvalidEmail(true);
        } else if (error.code === "auth/wrong-password") {
          setInvalidPassword(true);
        } else {
          // alert("Invalid email or password");
          setInvalidEmail(true);
          setInvalidPassword(true);
        }
      });

    // console.log(`Submitted email: ${email}, password: ${password}`);
  };

  return (
    <div id="login-tab-content" className="tabcontent">
      <form
        className="login-form"
        action=""
        method="post"
        onSubmit={handleSubmit}
      >
        <div className="inputBox">
          <input
            type="text"
            // className="input"
            className={`input ${invalidEmail ? "invalid" : ""}`}
            id="user_login"
            autoComplete="off"
            value={email}
            required="required"
            onChange={handleEmailChange}
          />
          <span>Email</span>
        </div>
        <div className="inputBox">
          <input
            type="password"
            // className="input"
            className={`${invalidPassword ? "invalid" : "input"}`}
            id="user_pass_login"
            autoComplete="off"
            value={password}
            required="required"
            onChange={handlePasswordChange}
          />
          <span>Password</span>
        </div>
        <input type="submit" className="button" value="Login" />
      </form>
      <div className="help-text">
        <p>
          <span>Do not have an account? </span>
          <button onClick={onSwitchPage}>Sign up now</button>
        </p>
      </div>
    </div>
  );
}

export default Login;
