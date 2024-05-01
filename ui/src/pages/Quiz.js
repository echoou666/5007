import React, { useState, useEffect } from "react";
import QuestionPreview from "../components/QuestionPreview";
import Loader from "../components/QuestionPreview";
import { client } from "../utils";
import { FlashcardArray } from "react-quizlet-flashcard";
import DailyCheckIn from "../components/Calendar";
import {Wrapper} from "./Home";

const Quiz = (props) => {
  // Set initial state
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const { selectedOption } = props.location.state;
  const [title, setTitle] = useState(selectedOption);

  // Fetch data from the API when the component mounts or when `selectedOption` changes
  useEffect(() => {
    if (selectedOption) {
      // Fetch data for the selected tag
      client(`/questions/search?tag=${encodeURIComponent(selectedOption)}`).then((res) => {
        setQuestions(res.data);
        setLoading(false);
      });
    } else {
      // Fetch all questions
      client("/questions").then((res) => {
        setQuestions(res.data);
        setLoading(false);
      });
      setTitle("All")
    }
  }, [selectedOption]);

  // Handle back button click
  const handleClick = () => {
    window.history.go(-1);
  };

  if (loading) {
    return <Loader />;
  }

  // Filter questions by the selected tag
  const filteredQuestions = selectedTag ? questions.filter(question => question.tags.includes(selectedTag)) : questions;

  // Format questions for the flashcard component
  const cards = filteredQuestions.map((question) => ({
    id: question.id,
    frontHTML: <div>{question.title}</div>,
    backHTML: <>{question.answer}</>,
  }));
  return (
    <>
      <div style={{ position: "absolute", left: 100, top: "8rem" }}>
        <DailyCheckIn />
      </div>

      <div
        style={{
          marginTop: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end", // Align content to the right
          margin: "2rem 0rem",
        }}
      >
        {/* A container for the quiz content */}
        <div className="parentContainer">
          {/* The title of the quiz */}
          <h1
            style={{
              marginTop: "1rem",
              marginLeft: "-2rem",
              color: "chocolate",
              backgroundColor: "lightyellow",
              borderRadius: "45%",
              padding: "0.5rem 1rem",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              display: "flex", // Display as a flex container
              justifyContent: "center", // Center the child elements horizontally
              alignItems: "center", // Center the child elements vertically
              // Other styling properties...
            }}
          >
            {title}
          </h1>

          {/* A container for the flashcard content */}
          <div
            className="storyContainer"
            style={{ marginRight: "1rem", marginTop: "4rem" }}
          >
            {/* Render the FlashcardArray component */}
            <FlashcardArray
              cards={cards}
              frontContentStyle={{
                backgroundColor: "lightgoldenrodyellow",
                color: "black",
                width: "700px",
                height: "700px",
                // Other styling properties...
              }}
              backContentStyle={{
                backgroundColor: "turquoise",
                width: "700px",
                height: "100%",
                // Other styling properties...
              }}
            />
          </div>

          {/* A button to indicate the user has finished the quiz */}
          <button
            style={{
              position: "absolute", // Add absolute positioning
              bottom: "5rem", // Position the button at the bottom of the container
              right: "6rem", // Position the button at the right side of the container
              margin: "1rem", // Add some margin
              backgroundColor: "lightsalmon",
              color: "white",
              padding: "1rem",
              borderRadius: "50%",
              fontFamily: "cursive",
              // Other styling properties...
            }}
            onClick={handleClick}
          >
            Finished
          </button>
        </div>
      </div>
    </>
  );
};

export default Quiz;