import React from "react";
import styled, { keyframes } from "styled-components";
import { LoaderIcon } from "./Icons";

// Define the rotation animation
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

// Style the loader wrapper
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  animation: ${rotate} 2s linear infinite;

  // Style the loader icon
  svg {
    height: 50px;
    width: 50px;
    fill: ${(props) => props.theme.secondaryColor};
  }

  // Adjust the loader icon size for smaller screens
  @media screen and (max-width: 500px) {
    svg {
      height: 40px;
      width: 40px;
    }
  }
`;

// Define the Loader component
const Loader = () => {
  return (
    // Render the loader wrapper with the animated loader icon
    <Wrapper>
      <LoaderIcon />
    </Wrapper>
  );
};

export default Loader;
