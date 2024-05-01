import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Follow from "./Follow";
import Avatar from "../styles/Avatar";
import { UserContext } from "../context/UserContext";
import { client } from "../utils";

// Styled component for the wrapper
const Wrapper = styled.div`
  width: 400px;
  margin-top: 2rem;
  position: fixed;
  top: 6rem;
  left: 70%;
  border-radius: 15px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  background-color: lightyellow;
  padding: 1rem;
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1));

  /* Styling for suggestions */
  .suggestions {
    margin-top: 1.8rem;
  }

  .suggestions div {
    width: 230px;
  }

  .suggestions > h3 {
    margin-bottom: 0.5rem;
    color: black;
  }

  .suggestions-usercard {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .suggestions img {
    width: 44px;
    height: 44px;
    border-radius: 22px;
  }

  .follow {
    position: relative;
    top: -0.3rem;
  }

  span {
    color: ${(props) => props.theme.blue};
    font-weight: 500;
  }

  /* Media queries */
  @media screen and (max-width: 1095px) {
    left: 67%;
  }

  @media screen and (max-width: 1040px) {
    display: none;
  }
`;

// Styled component for user card
const StyledUserCard = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  margin-right: 0.1rem;
  padding: 1rem;

  span {
    color: ${(props) => props.theme.secondaryColor};
    margin-left: 1rem;
  }
`;

// User card component
export const UserCard = ({ user }) => {
  const history = useHistory();

  return (
    <StyledUserCard>
      <Avatar
        className="pointer"
        onClick={() => history.push(`/${user.username}`)}
        lg
        src={user.avatar}
        alt="avatar"
      />

      <div className="user-info">
        <h3
          className="pointer"
          onClick={() => history.push(`/${user.username}`)}
        >
          {user.username}
        </h3>
        <span>{user.bio}</span>
      </div>
    </StyledUserCard>
  );
};

// Suggestions component
const Suggestions = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  // Fetch users on component mount
  useEffect(() => {
    client("/users").then((response) => {
      // Filter out users that the current user is already following
      setUsers(response.data.filter((user) => !user.isFollowing));
    });
  }, []);

  return (
    <Wrapper>
      <UserCard user={user} />

      <div className="suggestions">
        <h3>Recommendations</h3>
        {users.slice(0, 4).map((user) => (
          <div key={user.username} className="suggestions-usercard">
            <UserCard user={user} />
            <Follow nobtn isFollowing={user.isFollowing} userId={user._id} />
          </div>
        ))}
        {users.length === 0 && <p>Hi,you are the first user. There's no recommendation.</p>}
      </div>
    </Wrapper>
  );
};

export default Suggestions;