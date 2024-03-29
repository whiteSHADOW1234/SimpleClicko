import "./App.css";
import DashBoard from "./pages/dashboard";
import Store from "./pages/store";
import SideBar from "./pages/sideBar";
import "./loader.css";
import React, { useEffect, useState } from "react";
import Landing from "./auth/landing";
import { auth } from "./backend/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Routes } from "react-router-dom";
import Ranking from "./pages/ranking";
import Contest from "./pages/contest";
// import Forum from "./pages/forum";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);
  function handleLogin() {
    setLoggedIn(true);
  }

  return (
    <div>
      {loading ? (
        <div className="loading-bg">
          <div className="loader"></div>
        </div>
      ) : (
        <div>
          {loggedIn ? (
            <div className="main-bg">
              <SideBar />
              <Routes>
                <Route path="/" element={<DashBoard/>} />
                <Route path="/ranking" element={<Ranking/>} />
                <Route path="/store" element={<Store/>} />
                <Route path="/contest" element={<Contest/>} />
                {/* <Route path="/forum" element={<Forum/>} /> */}
              </Routes>
            </div>
          ) : (
            <div className="App">
              <div className="auth-section">
                <Landing onLogin={handleLogin} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
