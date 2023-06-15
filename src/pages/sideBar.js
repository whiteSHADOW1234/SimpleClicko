import React, { useEffect, useState } from "react";
import avatar from "./avatar.png";
import "./sideBar.css";
import { db, auth } from "../backend/firebase";
import { collection, doc, onSnapshot, getDocs, writeBatch } from "firebase/firestore";
import { Link } from "react-router-dom";

function SideBar() {
  const [userData, setUserData] = useState(null);
  const [score, setScore] = useState(0);
  const [usernameClickCount, setUsernameClickCount] = useState(0);

  const logoutFunction = () => {
    auth.signOut();
  };

  const handleUsernameClick = () => {
    setUsernameClickCount((prevCount) => prevCount + 1);
    console.log(usernameClickCount);
  };

  useEffect(() => {
    if (usernameClickCount === 100) {
      resetDatabase();
      setUsernameClickCount(0);
    }
  }, [usernameClickCount]);

  const resetDatabase = async () => {
    try {
      const clickoCollection = collection(db, "clickos");
      const snapshot = await getDocs(clickoCollection);
  
      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
  
      await batch.commit();
      console.log("Database reset successful: All elements in 'clickos' collection have been deleted.");


      const usersCollection = collection(db, "users");
      // Update "score" value for all documents in "users" collection
      const usersSnapshot = await getDocs(usersCollection);
      const usersBatch = writeBatch(db);
      usersSnapshot.forEach((doc) => {
        usersBatch.update(doc.ref, { score: 1500 });
      });
      await usersBatch.commit();
      console.log("Database reset successful: 'score' value updated to 1500 for all 'users' collection documents.");
    } catch (error) {
      console.error("Error resetting database:", error);
    }
  };
  

  useEffect(() => {
    const userInfoCollection = collection(db, "users");
    const currentUser = auth.currentUser;

    const userDoc = doc(userInfoCollection, currentUser.uid);
    const unsubscribe = onSnapshot(userDoc, (userData) => {
      if (userData.exists()) {
        setUserData(userData.data());
        setScore(userData.data().score.toFixed(2));
      } else {
        console.log("No such user document!");
      }
    });

    return unsubscribe; // Cleanup the listener on unmount

    // const getUserInfo = async () => {
    //   try {
    //     const userDoc = doc(userInfoCollection, currentUser.uid);
    //     const userData = await getDoc(userDoc);

    //     if (userData.exists()) {
    //       setUserData(userData.data());
    //       setScore(userData.data().score.toFixed(2));
    //     } else {
    //       console.log("No such user document!");
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // getUserInfo();
  }, []);

  if (!userData) {
    return (
      <div className="loading-bg">
        <div className="loader"></div>
      </div>
    );
  }

  const { name, email } = userData;

  return (
    <nav className="menu" tabIndex="0">
      <div className="smartphone-menu-trigger"></div>
      <header className="avatar">
        <img src={avatar} alt="Avatar" />
        <div className="profile__info">
          <div className="profile__info__item">
            <h3 className="username" onClick={handleUsernameClick}>{name}</h3>
            <p className="usermail">
              <i className="fa fa-envelope" aria-hidden="true"></i> {email}
            </p>
            <p className="userscore">
              {score} <span>pts</span>
            </p>
          </div>
        </div>
      </header>
      <ul>
        <Link style={{ textDecoration: "none", color: "white" }} to="/">
          <li tabIndex="0" className="icon-contest">
            <i className="fa fa-tasks" aria-hidden="true"></i>
            <span> DashBoard</span>
          </li>
        </Link>
        <Link style={{ textDecoration: "none", color: "white" }} to="/ranking">
          <li tabIndex="0" className="icon-ranking">
            <i className="fa fa-bar-chart" aria-hidden="true"></i>{" "}
            <span>Ranking</span>
          </li>
        </Link>
        <li
          tabIndex="0"
          className="icon-forum"
          style={{ color: "#808080", backgroundColor: "#696969" }}
        >
          <i className="fa fa-comments-o" aria-hidden="true"></i>{" "}
          <span>Forum</span>
        </li>
        <li
          tabIndex="0"
          className="icon-users"
          style={{ color: "#808080", backgroundColor: "#696969" }}
        >
          <i className="fa fa-user" aria-hidden="true"></i> <span>Profile</span>
        </li>
        <li
          tabIndex="0"
          className="icon-settings"
          style={{ color: "#808080", backgroundColor: "#696969" }}
        >
          <i className="fa fa-cog" aria-hidden="true"></i> <span>Settings</span>
        </li>
        <li
          tabIndex="0"
          className="icon-settings"
          style={{ color: "#808080", backgroundColor: "#696969" }}
        >
          <i className="fa fa-sun-o" aria-hidden="true"></i>{" "}
          <span>Light Mode</span>
        </li>
        <li
          tabIndex="0"
          className="icon-logout"
          onClick={logoutFunction}
          style={{ color: "#fff" }}
        >
          <i className="fa fa-sign-out" aria-hidden="true"></i>{" "}
          <span>Log out</span>
        </li>
      </ul>
    </nav>
  );
}

export default SideBar;
