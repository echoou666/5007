import React from "react";
import styled from "styled-components";

// Define a styled dropdown component
const StyledDropdown = styled.select`
  font-size: 1.2rem;
  padding: 0.5rem 2rem 0.5rem 1rem;
  border: none;
  border-radius: 30px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease-in-out;
  font-family: "Comic Sans MS", cursive; // Set a cute font

  // Add hover effect with background color change
  &:hover {
    background-color: #e0e0e0;
  }
`;

// Dropdown component with options and onChange handler
const Dropdown = ({ options, onChange }) => {
  const handleOptionChange = (e) => {
    const selectedOption = e.target.value;
    onChange(selectedOption);
  };

  return (
    <StyledDropdown onChange={handleOptionChange}>
      <option value="">Select a tag</option>
      {/* Render dropdown options */}
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </StyledDropdown>
  );
};

export default Dropdown;
