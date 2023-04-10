import React,{useEffect, useState} from "react";
import "./ranking.css";
import avatar from "./avatar.png";
import { db } from "../backend/firebase";

import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";


function Ranking() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const q = query(collection(db, "users"), orderBy("score", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setUsers(usersData);
    };
    getUsers();
  }, []);

  if (!users) {
    return (
      <div className="loading-bg">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="ranking_bg">
      <section className="top_three">
        {users.slice(0, 3).map((user, index) => (
          <div key={user.id} className={`place_${index + 1}`}>
            <img src={avatar} alt="Avatar" className="avatar" />
            <div className="player_name">{user.name}</div>
            <div className="player_score">- {user.score.toFixed(2)} pts -</div>
          </div>
        ))}
      </section>
      <section className="ranking_board">
        {users.slice(3).map((user, index) => (
          <React.Fragment key={user.id}>
            <div className="user_ranking">
              <div className="ranking_num">{index + 4}. </div>
              <div className="ranking_name">{user.name}</div>
              <div className="ranking_score">{user.score.toFixed(2)} pts</div>
            </div>
            {index !== users.length - 4 && <b className="hr anim"></b>}
          </React.Fragment>
        ))}
      </section>
    </div>
  );
}

export default Ranking;
