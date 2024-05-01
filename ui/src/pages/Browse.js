import React, { useEffect, useState } from "react";
import QuestionPreview from "../components/QuestionPreview";
import Loader from "../components/QuestionPreview";
import { client } from "../utils";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Wrapper } from "./Home";
import axios from "axios";

// Set axios baseURL to server address and port
axios.defaults.baseURL = "http://localhost:5003";

const Browse = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tag = queryParams.get("tag");
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [questionAll, setQuestionAll] = useState([]);
  const [questions_saved, setQuestions_saved] = useState([]);
  const [questions_recommend, setQuestions_recommend] = useState([]);
  const [is_search, setIs_Search] = useState(false);
  
  // Get username from localStorage
  const storedUser = localStorage.getItem("user");
  const username = JSON.parse(storedUser.toString()).username;

  // Call recommendations API
  const getRecommendations = async (questions_saved, questions) => {
    try {
      const response = await axios.post("/recommend", {
        user_liked_questions: JSON.stringify(questions_saved),
        all_questions: JSON.stringify(questions),
      });

      return response.data;
    } catch (error) {
      console.error("Error calling recommendations API:", error);
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      // Fetch data for questions_saved and questions
      const resQuestionsSaved = await client(`/users/${username}`);
      const resQuestions = await client(
        tag ? `/questions/search?tag=${encodeURIComponent(tag)}` : "/questions"
      );

      // Update state
      setQuestions_saved(resQuestionsSaved.data.savedQuestions);
      setQuestions(resQuestions.data);
      setQuestionAll(resQuestions.data);
      setLoading(false);

      // Call getRecommendations function
      if (resQuestions.data.length > 7) {
        const recommendedQuestions = await getRecommendations(
          resQuestionsSaved.data.savedQuestions,
          resQuestions.data
        );
        console.log("Recommendation result:", recommendedQuestions);
        setQuestions_recommend(recommendedQuestions.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error
    }
  };

  useEffect(() => {
    fetchData(); // Call asynchronous function
  }, []);

  function fetchSearchData(tag) {
    setIs_Search(true);
    console.log("Search is on http");
    client(`/questions/search?tag=${tag}`).then(({ data }) => {
      const [info] = data;
      console.log("Info", info);
      setQuestions(data);
    });
    setTimeout(() => toast.success("This search is successful"), 3000);
  }

  useEffect(() => {
    // Subscribe to 'handleQuery' event and call fetchSearchData function
    window.eventBus.on("handleQuery", fetchSearchData);
    return () => {
      // Unsubscribe from 'handleQuery' event
      window.eventBus.off("handleQuery", fetchSearchData);
    };
  }, []);

  console.log(questions_recommend);
  console.log(questions);

  if (loading) {
    return <Loader />;
  }

  return (
    <Wrapper>
        <div>
            {(!is_search && questions.length >= 8 && !tag) ? (
                <div>
                    <h2 style={{ color: "#00bcd4", textShadow: "1px 1px 2px #00bcd4" }}>Recommendations</h2>
                    <QuestionPreview questions={questions_recommend} />
                </div>
            ) :
                null
                    }
            <div>
                <h2 style={{ color: "#00bcd4", textShadow: "1px 1px 2px #00bcd4" }}>Question Ground</h2>
                <QuestionPreview questions={questions.filter(question => !questions_recommend.some(recommendQuestion => recommendQuestion._id === question._id))} />

            </div>
        </div>
    </Wrapper>
  );
};

export default Browse;
