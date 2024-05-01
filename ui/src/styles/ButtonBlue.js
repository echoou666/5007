import styled, { css } from "styled-components";

// Define a styled button component with blue background
const ButtonBlue = styled.button`
  background-color: #0077FF;
  border: none;
  padding: 0.5rem 1rem;
  color: #fff;
  border-radius: 50px;
  margin-top: 1rem;
  margin-left: 1rem;
  font-family: "Comic Sans MS", cursive; // Set a cute font
  font-size: 1rem;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2);

  // Add hover effect with background color change and scaling
  &:hover {
    background-color: #4DA8DA;
    cursor: pointer;
    transform: scale(1.05);
  }

  // Add transition effect for background color, scaling, and box shadow
  transition: background-color 0.3s ease-in-out,
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;

  // Add conditional styles for secondary button
  ${(props) =>
    props.secondary &&
    css`
      background: none;
      color: #242424;
      border: 1px solid #dbdbdb;
      font-weight: 500;

      // Add hover effect for secondary button
      &:hover {
        background-color: #f2f2f2;
      }
    `}
`;

export default ButtonBlue;
