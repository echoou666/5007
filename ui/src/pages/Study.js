import React, { useState, useEffect } from "react";
import QuestionList_Study from "../components/QuestionList_Study";
import ButtonGreen from "../styles/ButtonGreen";
import Loader from "../components/QuestionPreview";
import { client } from "../utils";
import Dropdown from "../styles/Dropdown";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Dashboard from "../components/Dashboard";
import Placeholder from "../components/Placeholder";

// Wrapper style for Study component
export const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  position: fixed; 
  top: 100px; 
  left: 15px; 
  bottom: 1px; 
  line-height: 3;
  padding: 1rem;
  overflow-y: scroll;
  @media screen and (max-width: 1040px) {
    justify-content: center;
    align-items: center;
  }
`;

const Study = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);

  // Fetch questions from API on component mount
  useEffect(() => {
    client("/questions").then((res) => {
      setQuestions(res.data);
      setLoading(false);
    });
  }, []);

  // Generate dropdown options from unique question tags
  useEffect(() => {
    const tags = questions.reduce((acc, question) => {
      return [...acc, ...question.tags];
    }, []);

    const uniqueTags = new Set(tags);

    const tagOptions = [...uniqueTags];

    setOptions(tagOptions);
  }, [questions]);

  // Update selected option when dropdown value changes
  const handleDropdownChange = (option) => {
    setSelectedOption(option);
  };

  if (loading) {
    return <Loader />;
  }

  let filteredQuestions = questions;

  if (selectedOption) {
    filteredQuestions = questions.filter((question) => question.tags.includes(selectedOption));
  }

  return (
    <Wrapper>
      <div style={{ marginTop: "2rem" }}>
        {questions.length === 0 ? (
          // Display placeholder when no questions are available
          <Placeholder
            title="Questions"
            text="Once you add a new question, they'll appear here"
            icon="question"
          />
        ) : (
          <>
            {/* Render dropdown component */}
            <Dropdown options={options} onChange={handleDropdownChange} />
            <div style={{ marginTop: "2rem" }}>
              {/* Render QuestionList_Study component */}
              <QuestionList_Study questions={filteredQuestions} />
            </div>
            <div style={{ position: "absolute", top: "3rem" , right: 0 }}>
              {/* Link to Quiz component with selected option */}
              <Link to={{ pathname: "/quiz", state: { selectedOption } }}>
                <ButtonGreen>Let's QUIZ!</ButtonGreen>
              </Link>
            </div>
            {/* Render Dashboard component */}
            <Dashboard />
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default Study;
