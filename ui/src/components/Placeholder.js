import React from "react";
import styled from "styled-components";
import { BookmarkIcon, QuestionIcon } from "./Icons";

const Wrapper = styled.div`
  /* Center the content */
  margin: auto;
  margin-top: 4rem;
  width: 450px;
  text-align: center;

  p {
    padding-top: 0.3rem;
  }

  svg {
    height: 50px;
    width: 50px;
    margin-bottom: 1rem;
  }

  /* Responsive styles */
  @media screen and (max-width: 500px) {
    svg {
      height: 35px;
      width: 35px;
    }

    width: 350px;
  }
`;

const Placeholder = ({ icon, title, text }) => {
  return (
    <Wrapper>
      {/* Render the icon based on the prop */}
      {icon === "bookmark" && <BookmarkIcon />}
      {icon === "question" && <QuestionIcon />}
      {/* Render the title and text */}
      <h2>{title}</h2>
      <p>{text}</p>
    </Wrapper>
  );
};

export default Placeholder;
