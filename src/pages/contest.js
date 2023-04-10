import { useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { db } from "../backend/firebase";
import { doc, updateDoc, onSnapshot, collection } from "firebase/firestore"; // getDoc
import "./contest.css";
var glicko2 = require("glicko2");

function Contest() {
  const location = useLocation();
  const { userName, userScore, clickoName, joinCode, userName2, uid001 } =
    location.state; //pending, userScore2
  const [status, setStatus] = React.useState(0);
  const [playingList, setPlayingList] = React.useState([]);
  const [player, setPlayer] = React.useState(true);
  var user2 = "";
  const [uid002, setUID002] = React.useState("");

  const clicko_name = clickoName;
  const join_code = joinCode;
  const user1 = userName;
  let user1_score = userScore;
  let user2_score;

  useEffect(() => {
    if (userName2 === undefined) {
      setPlayer(false);
    }
    const setOpponent = async () => {
      try {
        if (joinCode) {
          const clickoDoc = doc(collection(db, "clickos"), joinCode);
          const unsubscribe = onSnapshot(clickoDoc, (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              setPlayingList(data);
              setStatus(data.status);
              setUID002(data.uid002);
            }
          });
          return unsubscribe;
        }
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };
    setOpponent();
  }, [joinCode, userName2]);

  const { player02, playerScore2 } = playingList;
  user2 = player02;
  user2_score = playerScore2;

  useEffect(() => {
    if (joinCode) {
      try {
        updateDoc(doc(db, "clickos", joinCode), {
          code: joinCode,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }, [joinCode]);

  var settings = {
    tau: 0.5,
    rating: 1500,
    rd: 200,
    vol: 0.06,
  };
  var ranking = new glicko2.Glicko2(settings);

  const player1 = ranking.makePlayer(user1_score, settings.rd);
  const player2 = ranking.makePlayer(user2_score, settings.rd);
  var matches = [];
  const updateScores = async (winner) => {
    if (winner === "User1") {
      matches.push([player1, player2, 1]); //player1 won over player2
    } else if (winner === "User2") {
      matches.push([player1, player2, 0]); //player1 lost against player2
    } else {
      matches.push([player1, player2, 0.5]); //player1 and player2 drew
    }
    ranking.updateRatings(matches);

    user1_score = player1.getRating();
    user2_score = player2.getRating();

    await updateDoc(doc(db, "clickos", joinCode), {
      playerScore1: user1_score,
      playerScore2: user2_score,
    });
    await updateDoc(doc(db, "users", uid001), {
      score: user1_score,
    });
    await updateDoc(doc(db, "users", uid002), {
      score: user2_score,
    });
  };

  return (
    <div className="contest_pg">
      {status === 0 ? (
        <div className="contest_pending">
          <div className="contest_title">- {clicko_name} -</div>
          <div className="contest_join_code">Join Code: {join_code}</div>
          <div className="contest-loader">
            <div className="loader"></div>
          </div>
          <div className="terminate-container">
            <button
              className="end-button"
              onClick={async () => {
                await updateDoc(doc(db, "clickos", joinCode), {
                  status: 2,
                });
                window.history.back();
              }}
            >
              Terminate
            </button>
          </div>
        </div>
      ) : player ? (
        status === 2 ? (
          <button
            className="end-button"
            onClick={() => {
              window.history.back();
            }}
          >
            Go back
          </button>
        ) : (
          <div className="contest-loader">
            <div className="loader"></div>
          </div>
        )
      ) : (
        <div className="contest_complete">
          <div
            className="first_user"
            onClick={async () => {
              updateScores("User1");
              await updateDoc(doc(db, "clickos", joinCode), {
                status: 2, // end game
                result: 1, // user1 won
              });
              window.history.back();
            }}
          >
            {user1}
          </div>
          <div
            className="contest_title"
            onClick={async () => {
              updateScores("draw");
              await updateDoc(doc(db, "clickos", joinCode), {
                status: 2, // end game
                result: 0.5, // draw
              });
              window.history.back();
            }}
          >
            {clicko_name}
          </div>
          <div
            className="second_user"
            onClick={async () => {
              updateScores("User2");
              await updateDoc(doc(db, "clickos", joinCode), {
                status: 2, // end game
                result: 0, // user2 won
              });
              window.history.back();
            }}
          >
            {user2}
          </div>
        </div>
      )}
    </div>
  );
}

export default Contest;
