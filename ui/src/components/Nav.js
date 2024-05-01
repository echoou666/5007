import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import NewQuestion from "./NewQuestion";
import Search from "./Search";
import { UserContext } from "../context/UserContext";
import logo_quiz from "../assets/logo_quiz.png";
import { HomeIcon, ExploreIcon, HeartIcon } from "./Icons";

// styling for the navbar wrapper
const NavWrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 15px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  z-index: 11;

  .nav-logo {
    position: relative;
    top: 6px;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    width: 90%;
  }

  ul {
    display: flex;
    position: relative;
    top: 3px;
    list-style-type: none;
  }

  li {
    margin-left: 3.5rem;
  }

  /* media query for smaller screens */
  @media screen and (max-width: 970px) {
    nav {
      width: 100%;
    }
  }

  @media screen and (max-width: 670px) {
    input {
      display: none;
    }
  }
`;

const Nav = () => {
    const { user } = useContext(UserContext);

    return (
        <NavWrapper>
            <nav>
                {/* Link to the homepage */}
                <Link to="/">
                    {/* quiz logo */}
                    <img
                        className="nav-logo"
                        src={logo_quiz}
                        alt="logo"
                        style={{ maxWidth: "24%", maxHeight: "10%" }}
                    />
                </Link>
                {/* search bar */}
                <Search style={{ marginLeft: "1rem" }} />
                {/* list of navbar items */}
                <ul>
                    <li>
                        {/* create new question button */}
                        <NewQuestion />
                    </li>
                    <li>
                        {/* Link to the homepage */}
                        <Link to="/">
                            {/* home icon */}
                            <HomeIcon />
                        </Link>
                    </li>
                    <li>
                        {/* Link to the browse page */}
                        <Link to="/browse">
                            {/* explore icon */}
                            <ExploreIcon />
                        </Link>
                    </li>
                    <li>
                        {/* Link to the study page */}
                        <Link to="/study">
                            {/* heart icon */}
                            <HeartIcon />
                        </Link>
                    </li>
                    <li>
                        {/* Link to the user's profile */}
                        <Link to={`/${user.username}`}>
                            {/* user avatar */}
                            <img
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                }}
                                src={user.avatar}
                                alt="avatar"
                            />
                            {/* "Me" label */}
                            <svg width="32" height="24" viewBox="-8 -5 33 10" style={{border: '1px solid red;'}}>
                                <text>Me</text>
                            </svg>
                        </Link>
                    </li>
                </ul>
            </nav>
        </NavWrapper>
    );
};

export default Nav;
