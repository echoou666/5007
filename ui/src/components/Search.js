import React from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import ButtonBlue from "../styles/ButtonBlue";

// Styled input element
const InputWrapper = styled.input`
  padding: 0.5rem 4rem; /* Increase padding to make the input box larger */
  background: ${(props) => props.theme.bg};
  border: 1px solid ${(props) => props.theme.borderColor};
  font-family: "Comic Sans MS", cursive; /* Set a cute font */
  border-radius: ${(props) => props.theme.borderRadius};
`;

// Adjust default style of the BlueButton component
ButtonBlue.defaultProps = {
  style: {
    "margin-top": "0",
  },
};

const Search = () => {
  // Custom hook to handle the state of the search input
  const searchterm = useInput("");

  // Function to handle the search when enter key is pressed or search button is clicked
  const handleSearch = (e) => {
    if (e.keyCode && e.keyCode !== 13) {
      return;
    }
    searchterm.setValue("");
    window.eventBus.emit('handleQuery', searchterm.value);
    // toast.success("Sorry, the search feature isn't finished yet");
  };

  return (
    <>
      <InputWrapper 
        type="text"
        value={searchterm.value}
        onKeyDown={handleSearch}
        onChange={searchterm.onChange}
        placeholder="Input a theme"
      />
      <ButtonBlue onClick={handleSearch}>Search</ButtonBlue>
    </>
  );
};

export default Search;
