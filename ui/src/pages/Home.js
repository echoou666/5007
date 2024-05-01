import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import Suggestions from "../components/Suggestions";
import NoFeedSuggestions from "../components/NoFeedSuggestions";
import Question from "../components/Question";
import Loader from "../components/Loader";
import { FeedContext } from "../context/FeedContext";
import { UserContext } from "../context/UserContext";
import { client } from "../utils";
import { toast } from "react-toastify";

// Define the wrapper styles
export const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  position: fixed;
  top: 100px;
  left: 15px;
  bottom: 1px;
  padding: 1rem;
  overflow-y: scroll;
  @media screen and (max-width: 1040px) {
    justify-content: center;
    align-items: center;
  }
`;

const Home = () => {
  // Use the UserContext and FeedContext
  const { setUser } = useContext(UserContext);
  const { feed, setFeed } = useContext(FeedContext);

  // Set initial state
  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState({});
  const [feedAll, setFeedAll] = useState([]);

  // Get the user's feed
  function getFeed() {
    client("/users/feed")
      .then((res) => {
        setFeed(res.data);
        setFeedAll(res.data);
        setLoading(false);
      })
      .catch((res) => console.log(res));
  }

  // Call getFeed and logout on component mount
  useEffect(() => {
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    };
    // logout()
    getFeed();
  }, [setFeed, setUser]);

  // Filter feed based on tag
  function fetchSearchData(tag) {
    if (!tag) {
      setFeed(feedAll);
      return;
    }
    const filterData = feedAll.filter(
      (item) =>
        item.tags.some((tagItem) => tagItem.includes(tag)) ||
        item.title.includes(tag)
    );
    setFeed(filterData);
  }

  // Add event listener for filtering feed by tag
  useEffect(() => {
    window.eventBus.on("handleQuery", fetchSearchData);
    return () => {
      window.eventBus.off("handleQuery", fetchSearchData);
    };
  }, [feedAll]);

  // Add event listener for updating feed after submitting a question
  useEffect(() => {
    window.eventBus.on("submitSuccess", getFeed);
    return () => {
      window.eventBus.off("submitSuccess", getFeed);
    };
  }, []);

  // Show loading spinner while loading feed
  if (loading) {
    return <Loader />;
  }

  return (
    <Wrapper>
      {feed.length > 0 ? (
        <>
          <div className="home">
            {feed.map((question) => (
              <Question key={question._id} question={question} />
            ))}
          </div>
          <Suggestions />
        </>
      ) : (
        <NoFeedSuggestions />
      )}
    </Wrapper>
  );
};

export default Home;
