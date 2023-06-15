import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import { db, auth } from "../backend/firebase";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

function DashBoard() {
  const [inputValues, setInputValues] = useState([]);
  const [userData, setUserData] = useState(null);
  const [clickos, setClickos] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const clickosCollection = collection(db, "clickos");
    const unsubscribe = onSnapshot(clickosCollection, (snapshot) => {
      const clickosList = [];
      snapshot.forEach((doc) => {
        clickosList.push({ id: doc.id, ...doc.data() });
      });
      setClickos(clickosList);
    });

    const userInfoCollection = collection(db, "users");
    const currentUser = auth.currentUser;

    const getUserInfo = async () => {
      try {
        const userDoc = doc(userInfoCollection, currentUser.uid);
        const userData = await getDoc(userDoc);

        if (userData.exists()) {
          setUserData(userData.data());
        } else {
          console.log("No such user document!");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserInfo();
    return unsubscribe;
  }, []);

  if (!userData) {
    return (
      <div className="loading-bg">
        <div className="loader"></div>
      </div>
    );
  }

  const { name, score } = userData; // ClickoTime, identity
  var joinCode;

  const handleCreateClicko = async () => {
    try {
      const docRef = await addDoc(collection(db, "clickos"), {
        player01: name,
        uid001: auth.currentUser.uid,
        uid002: "",
        player02: "",
        clickoName: document.getElementById("clicko_name").value,
        status: 0,
        result: "",
        code: "",
        playerScore1: score,
        playerScore2: 0,
      });
      joinCode = docRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    const state = {
      uid001: auth.currentUser.uid,
      userName: name,
      userScore: score,
      clickoName: document.getElementById("clicko_name").value,
      joinCode: joinCode,
      pending: 0, // waiting for opponent
    };
    navigate("/contest", { state: state });
  };

  const handleInvite = (clickoId, inputValue) => {
    if (inputValue !== clickoId) {
      alert("Wrong Code !!!");
      return;
    } else if (
      auth.currentUser.uid ===
      clickos.find((clicko) => clicko.id === clickoId).uid001
    ) {
      alert("You can't join your own Clicko");
      return;
    } else {
      updateDoc(doc(db, "clickos", clickoId), {
        status: 1,
        player02: name,
        playerScore2: score,
        uid002: auth.currentUser.uid,
      });
      const state = {
        uid002: auth.currentUser.uid,
        userName2: name,
        userScore2: score,
        pending: 1, // in progress
        joinCode: clickoId,
      };
      navigate("/contest", { state: state });
    }
  };

  // var totalCreateTime = 5;

  // if (identity === "normal") {
  //   totalCreateTime = 5;
  // } else if (identity === "premium") {
  //   totalCreateTime = 10;
  // } else if (identity === "admin") {
  //   totalCreateTime = 15;
  // }

  return (
    <div className="dashboard_bg">
      <section className="notifications">
        <div className="coffee-card">
          <span className="title">&#9749; Clicko Notice</span>
          <p className="description">
            We are still in the process of building this website. Every time 20
            new members join, we will add a new feature to it.
          </p>
        </div>
        <div className="coffee-card">
          <span className="title">&#x1F4B5; Donation Notice</span>
          <p className="description">
            This is a work in progress, you can donate to keep it going. If you
            donate more than 50 NT$, you'll get a free premium membership.
          </p>
        </div>
        <div className="coffee-card">
          <span className="title">&#x1F41E; Bug Report Notice</span>
          <p className="description">
            If you find any bugs, please report them to us. We'll fix them as
            soon as possible. <br />
            Find us on{" "}
            <a href="https://www.facebook.com/NCUcafeclub">Facebook</a>.
            <br />
          </p>
        </div>
      </section>
      {clickos.some((clicko) => clicko.status !== 2) ? (
        <section className="contest_board">
          {clickos.map((clicko, index) => (
            <div className="contest_list" key={clicko.id}>
              <div className="contest_item">
                <div className="contest_title">{clicko.clickoName}</div>
                <div className="contest_time">
                  {clicko.status === 0
                    ? "pending"
                    : clicko.status === 1
                    ? "waiting"
                    : "end"}
                </div>
                {clicko.status === 0 ? (
                  <div className="input-container">
                    <input
                      required=""
                      value={inputValues[index]}
                      onChange={(e) => {
                        const newValues = [...inputValues];
                        newValues[index] = e.target.value;
                        setInputValues(newValues);
                      }}
                    />
                    <button
                      className="invite-btn"
                      type="button"
                      onClick={() =>
                        handleInvite(clicko.id, inputValues[index])
                      }
                    >
                      Join
                    </button>
                  </div>
                ) : (
                  <div className="contest_time">
                    {clicko.result === 0
                      ? "user2 won"
                      : clicko.result === 0.5
                      ? "drew"
                      : clicko.result === 1
                      ? "user1 won"
                      : "terminate"}
                  </div>
                )}
              </div>
              <div className="h-divider">
                <div className="shadow"></div>
              </div>
            </div>
          ))}
          <div
            style={{
              height: "20px",
            }}
          />
        </section>
      ) : (
        <div className="empty-contest">
          <img src="/todo.gif" alt="Todo GIF" className="centered-gif" />
        </div>
      )}

      <section className="add_contest">
        <div className="create_contest">
          <span className="title">Create your Clicko</span>
          <div className="create_description">
            Create a Clicko and invite your friends to compete with you.
            <div className="light-loader">
              <div className="loader"></div>
            </div>
          </div>
        </div>
        <div className="create_clicko">
          <input
            type="text"
            className="clicko_name"
            id="clicko_name"
            name="clicko_name"
            placeholder="Clicko Name"
            autoComplete="off"
          />
          <input
            className="button--submit"
            value="Create"
            type="submit"
            onClick={handleCreateClicko}
          />
        </div>
        {/* <div className="create_footer">Time left: {ClickoTime}/{totalCreateTime}</div> */}
      </section>
    </div>
  );
}

export default DashBoard;
