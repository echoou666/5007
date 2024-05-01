import React, { useEffect, useState } from "react";
import { client } from "../utils";
import { toast } from "react-toastify";
import { BookmarkIcon, FilledBookmarkIcon } from "./Icons";

const SaveQuestion = ({ isSaved, questionId }) => {
  const [savedState, setSaved] = useState(isSaved); // State to keep track of whether the question is saved

  useEffect(() => {
    setSaved(isSaved); // Set the saved state to the current value of isSaved prop
  }, [isSaved]);

  const handleToggleSave = () => {
    if (savedState) { 
      setSaved(false);
      client(`/questions/${questionId}/toggleSave`);
      toast.success('Your question has been canceled successfully'); 
    } else { 
      setSaved(true);
      client(`/questions/${questionId}/toggleSave`); 
      toast.success('Your question has been saved successfully'); 
    }
  };

  // If the question is saved, display the filled bookmark icon and handle toggle save on click
  if (savedState) {
    return <FilledBookmarkIcon onClick={handleToggleSave} />;
  }

  // If the question is not saved, display the bookmark icon and handle toggle save on click
  if (!savedState) {
    return <BookmarkIcon onClick={handleToggleSave} />;
  }
};

export default SaveQuestion;
