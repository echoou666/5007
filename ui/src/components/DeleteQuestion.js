import React, { useContext } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { FeedContext } from "../context/FeedContext";
import { client } from "../utils";

// Component for deleting a question
const DeleteQuestion = ({ questionId, closeModal, goToHome }) => {
  // Get the feed and setFeed from the FeedContext
  const { feed, setFeed } = useContext(FeedContext);
  const history = useHistory();

  // Function to handle delete question
  const handleDeleteQuestion = () => {
    // Close the modal
    closeModal();

    // Redirect to home page if goToHome is true
    if (goToHome) {
      history.push(`/`);
    }

    // Filter out the deleted question from the feed
    setFeed(feed.filter((question) => question._id !== questionId));

    // Show success message
    toast.success("Your question has been deleted successfully");

    // Call the delete API to delete the question from the server
    client(`/questions/${questionId}`, { method: "DELETE" });
  };

  // Render a delete button
  return (
    <span className="danger" onClick={handleDeleteQuestion}>
      Delete Question
    </span>
  );
};

export default DeleteQuestion;
