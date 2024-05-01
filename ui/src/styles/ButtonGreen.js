import styled from "styled-components";

// Define a styled button component with green background
const ButtonGreen = styled.button`
  background-color: #00a693;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1.4rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-family: "Comic Sans MS", cursive; // Set a cute font

  // Add hover effect with background color change
  &:hover {
    background-color: #006600;
  }

  // Add active effect with translateY transformation
  &:active {
    transform: translateY(1px);
  }
`;

export default ButtonGreen;
