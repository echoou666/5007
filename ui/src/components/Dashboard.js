import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Avatar from "../styles/Avatar";


// define a styled component called Wrapper
const Wrapper = styled.div`
  width: 350px;
  margin-top: 2rem;
  position: fixed;
  top: 6rem;
  left: 70%;
  border-radius: 15px;
  // z-index: 3;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  background-color: lightyellow; /* set background color */
  padding: 1rem; /* add padding */
  /* cute shadow effect */
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1));

  .suggestions {
    margin-top: 1.8rem;
  }

  .suggestions div {
    width: 230px;
  }

  .suggestions > h3 {
    margin-bottom: 0.5rem;
    color: black; /* set title color */
  }

  .suggestions-usercard {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    margin-bottom: 1rem; /* add bottom margin */
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

  @media screen and (max-width: 1095px) {
    left: 67%;
  }

  @media screen and (max-width: 1040px) {
    display: none;
  }
`;

// define another styled component called StyledUserCard
const StyledUserCard = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  margin-right: 0.1rem;
  padding: 1rem; /* add padding */
  
  span {
    color: ${(props) => props.theme.secondaryColor};
    margin-left: 1rem; /* add left margin */
  }
`;

// create a functional component called UserCard with user prop
export const UserCard = ({ user }) => {
    const history = useHistory();

    return (
        // render the UserCard with Avatar, user information and links to user profile
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

// create a functional component called Dashboard
const Dashboard = () => {

    return (
        <Wrapper>
          <h4>Tips:</h4>
          <p>* These questions are generated from your collections and your questions.</p>
          <p>* Now you can select a tag to begin your study journey.</p>
        </Wrapper>
    );
};

export default Dashboard;
