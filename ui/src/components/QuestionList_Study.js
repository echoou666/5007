import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { FilledHeartIcon, CommentIcon } from "./Icons";

// Styling for the component
const Wrapper = styled.div`
  margin-top: 1rem;
  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr;
  text-align: left;
  grid-gap: 1.5rem;

  // Styling for the question list
  QuestionList {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
    text-align: left;
  }

  // Styling for the image container
  div {
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    width: 850px;
    height: 180px;
    object-fit: cover;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  // Styling for the image overlay container
  .container-overlay {
    position: relative;
  }

  // Styling for the image overlay when hovering over the container
  .container-overlay:hover .overlay {
    display: block;
  }

  // Styling for the image overlay
  .overlay {
    border-radius: 10px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    width: 850px;
    height: 180px;
    z-index: 4;
    display: none;
  }

  // Styling for the content of the image overlay
  .overlay-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: ${(props) => props.theme.white};
    font-weight: 500;
    font-size: 0.9rem;
  }

  // Styling for the heart and comment icons
  svg {
    fill: ${(props) => props.theme.white};
    position: relative;
    top: 4px;
  }

  // Styling for the text in the image overlay
  span {
    display: flex;
    display: block;
    align-items: center;
    padding-right: 0.5rem;
  }

  span:first-child {
    margin-right: 1rem;
  }

  // Media queries for responsive design
  @media screen and (max-width: 1000px) {
    div,
    .overlay {
      width: 233px;
      height: 60px;
    }
  }

  @media screen and (max-width: 800px) {
    div,
    .overlay {
      width: 200px;
      height: 60px;
    }
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: 1fr;
    div,
    .overlay {
      height: 80px;
      width: 100%;
    }
  }

  @media screen and (max-width: 500px) {
    grid-gap: 1rem;
    div,
    .overlay {
      height: 60px;
      width: 100%;
    }
  }

  @media screen and (max-width: 400px) {
    div,
    .overlay {
      height: 50px;
      width: 100%;
    }
  }
`;

// Component that displays a preview of study
const ProfilePreview_Study = ({ questions }) => {
    const history = useHistory();
    return (
        <Wrapper>
            {questions?.map((question) => (
                <div
                    key={question._id}
                    className="container-overlay"
                    onClick={() => history.push(`/p/${question._id}`)}
                >
                    <p>{question.title}</p>

                    <div className="overlay">
                        <div className="overlay-content">
				<span>
				  {question.answer}
				</span>
                        </div>
                    </div>
                </div>
            ))}
        </Wrapper>
    );
};

export default ProfilePreview_Study;