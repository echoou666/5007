import React, { useEffect, useState } from "react";
import ButtonBlue from '../styles/ButtonBlue';
import { client } from "../utils";

// Component for the Follow button, with options to increment or decrement the number of followers
const Follow = ({ nobtn, isFollowing, incFollowers, decFollowers, userId }) => {
  const [followingState, setFollowingState] = useState(isFollowing);

  useEffect(() => setFollowingState(isFollowing), [isFollowing]);

  const handleFollow = () => {
    if (followingState) {
      // If the user is currently following, unfollow and decrement the number of followers (if applicable)
      setFollowingState(false);
      if (decFollowers) {
        decFollowers();
      }
      client(`/users/${userId}/unfollow`);
    } else {
      // If the user is not currently following, follow and increment the number of followers (if applicable)
      setFollowingState(true);
      if (incFollowers) {
        incFollowers();
      }
      client(`/users/${userId}/follow`);
    }

    window.location.reload();
  };

// Display the Follow or Following button depending on the current followingState
  if (followingState) {
    return (
      <ButtonBlue onClick={() => handleFollow()}>Following</ButtonBlue>
    );
  } else {
    return (
      <ButtonBlue onClick={() => handleFollow()}>Subscribe</ButtonBlue>
    );
  }
};

export default Follow;
