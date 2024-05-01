import React from "react";
import styled from "styled-components";
import avatar from "../assets/default_avatar.jpg";
import ButtonBlue from "../styles/ButtonBlue";

// Define a styled component called "Wrapper"
const Wrapper = styled.div`
  display: block;
  flex-direction: column;
  justify-content: center;
  width: 175px;
  height: 100px;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 4px;
  margin-right: 1rem;
  align-items: center;
  border-radius: 20px; // This line is redundant since border-radius is already defined above

  // Style the img tag inside the Wrapper component
  img {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    margin-bottom: 1rem;
  }

  // Style the element with class "fullname" inside the Wrapper component
  .fullname {
    font-size: 0.9rem;
    color: ${(props) => props.theme.secondaryColor};
  }
`;

// Define a functional component called "ProfilePreview"
const ProfilePreview = ({ user }) => {
  return (
    // Render the Wrapper component with some child elements
    <Wrapper key={user.username}>
      <img src={avatar} alt="avatar" />
      <h4>{user.username}</h4>
      <span className="fullname">{user.fullname}</span>
      <ButtonBlue>Subscribe</ButtonBlue>
    </Wrapper>
  );
};

export default ProfilePreview;
