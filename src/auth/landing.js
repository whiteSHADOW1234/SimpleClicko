import React, { useState } from "react";
import "./landing.css";
import Signup from "./signup";
import Login from "./login";

function Landing({ onLogin }) {
  const [currentPage, setCurrentPage] = useState("login");

  const handleSwitchPage = () => {
    if (currentPage === "login") {
      setCurrentPage("signup");
    } else {
      setCurrentPage("login");
    }
  };

  return (
    <div className="landing-screen">
      <h1 className="landing-title">Clicko</h1>
      <h2 className="landing-subtitle">~ A simple rating system ~</h2>
      {currentPage === "login" ? (
        <Login onSwitchPage={handleSwitchPage} onLogin={onLogin}/>
      ) : (
        <Signup onSwitchPage={handleSwitchPage} onLogin={onLogin}/>
      )}
    </div>
  );
}

export default Landing;
