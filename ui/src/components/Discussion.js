import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Avatar from "../styles/Avatar";

// Wrapper component for each discussion item
const DiscussionWrapper = styled.div`
  display: flex;

  span {
    padding-right: 0.4rem;
  }
`;

// Discussion component
const Discussion = ({ discussion, hideavatar }) => {
  const history = useHistory();

  return (
    <DiscussionWrapper style={{ padding: !hideavatar ? "0.4rem 0" : "" }}>
      {!hideavatar && (
        // Render user's avatar if hideavatar prop is not passed
        <Avatar
          className="pointer"
          onClick={() => history.push(`/${discussion.user.username}`)}
          src={discussion.user.avatar}
          alt="avatar"
        />
      )}

      {/* Render the user's username and text of the discussion */}
      <p>
        <span
          onClick={() => history.push(`/${discussion.user.username}`)}
          className="bold pointer"
        >
          {discussion.user.username}
        </span>
        {discussion.text}
      </p>
    </DiscussionWrapper>
  );
};

export default Discussion;
