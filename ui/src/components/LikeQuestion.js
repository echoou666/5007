import React, { useEffect, useState } from "react";
import { client } from "../utils";
import { HeartIcon2, FilledHeartIcon } from "./Icons";

const LikeQuestion = ({ isLiked, questionId, incLikes, decLikes }) => {
  // Use state to keep track of whether the question has been liked or not
  const [likedState, setLiked] = useState(isLiked);

  // Update the liked state whenever the isLiked prop changes
  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  // Handle toggling the like for the question
  const handleToggleLike = () => {
    if (likedState) {
      // If the question is currently liked, unlike it and decrement the like count
      setLiked(false);
      decLikes();
      client(`/questions/${questionId}/toggleLike`);
    } else {
      // If the question is currently unliked, like it and increment the like count
      setLiked(true);
      incLikes();
      client(`/questions/${questionId}/toggleLike`);
    }
  };

  // Render the appropriate heart icon based on whether the question has been liked or not
  if (likedState) {
    return <FilledHeartIcon onClick={handleToggleLike} />;
  }

  if (!likedState) {
    return <HeartIcon2 onClick={handleToggleLike} />;
  }
};

export default LikeQuestion;
