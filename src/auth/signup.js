import React, { useState } from "react";
import "./signup.css";
import { auth } from "../backend/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../backend/firebase";
import { doc, setDoc } from "firebase/firestore";

function Signup({ onSwitchPage, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");

  const [formDataInvalid, setFormDataInvalid] = useState({
    username: false,
    password: false,
    passwordConfirm: false,
    email: false,
  });

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setFormDataInvalid({
      ...formDataInvalid,
      username: false,
    });
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setFormDataInvalid({
      ...formDataInvalid,
      password: false,
    });
  };

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirm(event.target.value);
    setFormDataInvalid({
      ...formDataInvalid,
      passwordConfirm: false,
    });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setFormDataInvalid({
      ...formDataInvalid,
      email: false,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== passwordConfirm) {
      alert("Passwords do not match");
      setFormDataInvalid({
        ...formDataInvalid,
        password: true,
        passwordConfirm: true,
      });
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log("user: ", user);
        // Add user's email and name to Firestore
        setDoc(doc(db, "users", user.uid), {
          email: email,
          name: username,
          pd: window.btoa(password),
          score: 1500,
          win: 0,
          lose: 0,
          avatar: "",
          identity: "normal",
          ClickoTime: 5,
        });
        onLogin();
      })
      .catch((error) => {
        console.log("error: ", error);
        if (error.code === "auth/email-already-in-use") {
          setFormDataInvalid({
            ...formDataInvalid,
            email: true,
          });
          alert("Email already in use");
        } else if (error.code === "auth/invalid-email") {
          setFormDataInvalid({
            ...formDataInvalid,
            email: true,
          });
          alert("Invalid email");
        } else if (error.code === "auth/weak-password") {
          setFormDataInvalid({
            ...formDataInvalid,
            password: true,
          });
          alert("Password must be at least 6 characters");
        } else {
          setFormDataInvalid({
            ...formDataInvalid,
            username: true,
            password: true,
            passwordConfirm: true,
            email: true,
          });
          alert("Error creating account");
        }
      });

    // console.log(`Submitted username: ${username}, password: ${password}, email: ${email}`);
  };

  return (
    <div
      id="signup-tab-content"
      className="tabcontent"
      style={{ display: "block" }}
    >
      <form
        className="signup-form"
        action=""
        method="post"
        onSubmit={handleSubmit}
      >
        <div className="inputBox">
          <input
            type="text"
            className={`input ${formDataInvalid.email ? "invalid" : ""}`}
            id="user_email_signup"
            data-testid="user_email_signup"
            autoComplete="off"
            required="required"
            value={email}
            onChange={handleEmailChange}
          />
          <span>Email</span>
        </div>
        <div className="inputBox">
          <input
            type="text"
            className={`input ${formDataInvalid.username ? "invalid" : ""}`}
            id="user_name_signup"
            data-testid="user_name"
            autoComplete="off"
            required="required"
            value={username}
            onChange={handleUsernameChange}
          />
          <span>UserName</span>
        </div>
        <div className="inputBox">
          <input
            type="password"
            className={`input ${formDataInvalid.password ? "invalid" : ""}`}
            id="user_pass_signup"
            data-testid="Password"
            autoComplete="off"
            required="required"
            value={password}
            onChange={handlePasswordChange}
          />
          <span>Password</span>
        </div>
        <div className="inputBox">
          <input
            type="password"
            className={`input ${formDataInvalid.passwordConfirm ? "invalid" : ""}`}
            id="user_pass_confirm"
            data-testid="Confirm-Password"
            autoComplete="off"
            required="required"
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
          />
          <span>Confirm Password</span>
        </div>
        <input type="submit" className="button" value="Sign Up" />
      </form>
      <div className="help-text">
        <p>
        <span>Already have an account? </span>
        <button onClick={onSwitchPage}>Log in now</button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
