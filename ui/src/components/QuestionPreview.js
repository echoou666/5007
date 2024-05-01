import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { FilledHeartIcon, CommentIcon } from "./Icons";

const Wrapper = styled.div`
  margin-top: 1rem;
  cursor: pointer;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1.5rem;

  /* style for image container */
  div {
    border-radius: 10px; /* add rounded corners */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* add shadow effect */
    width: 300px;
    height: 300px;
    object-fit: cover;
  }

  /* style for overlay container */
  .container-overlay {
    position: relative;
  }

  /* show overlay on hover */
  .container-overlay:hover .overlay {
    display: block;
  }

  /* style for overlay */
  .overlay {
    border-radius: 10px; /* add rounded corners */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    width: 300px;
    height: 300px;
    z-index: 4;
    display: none;
  }

  /* style for overlay content */
  .overlay-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: ${(props) => props.theme.white};
    font-weight: 500;
    font-size: 1.1rem;
  }

  /* style for svg icons */
  svg {
    fill: ${(props) => props.theme.white};
    position: relative;
    top: 4px;
  }

  /* style for span elements */
  span {
    display: flex;
    display: block;
    align-items: center;
    padding-right: 0.5rem;
  }

  span:first-child {
    margin-right: 1rem;
  }

  /* media queries for different screen sizes */
  @media screen and (max-width: 1000px) {
    div,
    .overlay {
      width: 233px;
      height: 233px;
    }
  }

  @media screen and (max-width: 800px) {
    div,
    .overlay {
      width: 200px;
      height: 200px;
    }
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: 1fr 1fr;

    div,
    .overlay {
      height: 240px;
      width: 100%;
    }
  }

  @media screen and (max-width: 500px) {
    grid-gap: 1rem;

    div,
    .overlay {
      height: 200px;
      width: 100%;
    }
  }

  @media screen and (max-width: 400px) {
    div,
    .overlay {
      height: 170px;
      width: 100%;
    }
  }
`;


const ProfilePreview = ({ questions }) => {
  const history = useHistory();
  console.log(questions)
  return (
      <Wrapper>
        {questions?.map((question) => (
            <div
                key={question._id}
                className="container-overlay"
                onClick={() => history.push(`/p/${question._id}`)}
            >
                <p>{question.title}</p>
                {console.log(question)}
                <hr />
                {question.files && question.files[0] !== "" && question.files.length > 0 ? (
                    // 如果question.files有值且长度大于0，则展示question.files[0]
                    <img src={question.files[0]} alt="Question File" style={{ maxWidth: "100%", height: "auto" }} />
                ) : (
                    // 否则展示question.answer
                    <p>{question.answer.length > 320 ? `${question.answer.slice(0, 320)}...` : question.answer}</p>

                )}

              <div className="overlay">
                <div className="overlay-content">
              <span>
                <FilledHeartIcon /> {question.likesCount}
              </span>
                  <span>
                <CommentIcon /> {question.discussionsCount}
              </span>
                </div>
              </div>
            </div>
        ))}
      </Wrapper>
  );
};


export default ProfilePreview;
