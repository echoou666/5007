import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Avatar from "../styles/Avatar";
import Follow from "./Follow";
import { client } from "../utils";
import Loader from "./Loader";

const Wrapper = styled.div`
  /* Styles for the wrapper component */
  background: lightyellow;
  border: 1px solid ${(props) => props.theme.borderColor};
  width: 600px;
  padding: 1rem;
  justify-self: center;
  border-radius: 10px; /* Adds rounded corners */
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2); /* Adds shadow effect */

  .suggestion {
    /* Styles for the suggestion component */
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .user-info {
    /* Styles for the user-info component */
    display: flex;
    align-items: center;
  }

  button {
    /* Styles for the button component */
    font-size: 0.9rem;
    position: relative;
    top: -5px;
  }

  @media screen and (max-width: 660px) {
    width: 500px;
  }

  @media screen and (max-width: 530px) {
    width: 450px;
  }

  @media screen and (max-width: 480px) {
    width: 380px;
  }

  @media screen and (max-width: 400px) {
    width: 340px;

    button {
      font-size: 0.8rem;
    }
  }
`;

const NoFeedSuggestions = () => {
  const [users, setUsers] = useState([]); // state to store user data
  const [loading, setLoading] = useState(true); // state to indicate loading status
  const history = useHistory(); // hook to access the browser history

  useEffect(() => {
    // fetch user data on component mount
    client("/users").then((res) => {
      setUsers(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    // show a loader if data is still loading
    return <Loader />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h3 style={{ marginBottom: "0.7rem" }}>Recommendations</h3>
      <div style={{ display: "flex" }}>
        <Wrapper>
          {/* Render a suggestion component for each user */}
          {users.length === 0 && <p>Hi,you are the first user. There's no recommendation.</p>}
          {users.map((user) => (
            <div key={user._id} className="suggestion">
              <div className="user-info">
                {/* Render the user's avatar */}
                <Avatar
                  className="pointer"
                  onClick={() => history.push(`/${user.username}`)}
                  src={user.avatar}
                  alt="avatar"
                />
                <div className="user-meta">
                  {/* Render the user's username */}
                  <h4
                    className="pointer"
                    onClick={() => history.push(`/${user.username}`)}
                  >
                    {user.username}
                  </h4>
                  {/* Render the user's bio */}
                  <span className="secondary">{user.bio}</span>
                </div>
              </div>
              {/* Render a follow component */}
              <Follow isFollowing={user.isFollowing} userId={user._id} />
            </div>
          ))}
        </Wrapper>
      <div style={{ marginLeft: "2rem", padding: "2rem", background: "lightblue", borderRadius: "10px" ,height: "150px"}}>
        <h4>Tips:</h4>
        <p>* Follow someone from the left and then you can see the questions with answers.</p>
        <p>* Or you can click the Add button on the top to create by yourself.</p>
      </div>
    </div>
    </div>
  );
};

export default NoFeedSuggestions;
