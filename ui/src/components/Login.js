import React, { useContext } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { client } from "../utils";
import useInput from "../hooks/useInput";
import { UserContext } from "../context/UserContext";
import logo_quiz from "../assets/logo_quiz.png";
import { useHistory } from "react-router-dom";
import BackgroundImg from "../assets/LoginPic.png";
import ButtonGreen from "../styles/ButtonGreen";

// Title styled component
const Title = styled.h1`
  font-size: 2rem;
  font-family: 'Comic Sans MS', cursive;
  color: #333;
  margin-top: 2rem;
  text-align: center;
  transform: translateY(2rem);
`;

// InputBox components
export const Label = styled.label`
  color: #595959;
  display: block;
  text-align: left;
`;

export const InputWrapper1 = styled.div`
  width: 80%;
  margin: 15px;
  font-family: "Comic Sans MS", cursive;
`;

export const Input = styled.input`
  width: 100%;
  height: 30px;
  border-radius: 2px;
  border: 1px solid #989797;
  padding-left: 5px;
  box-sizing: border-box;
  font-family: "Comic Sans MS", cursive;

  &:focus {
    border: 1px solid #5effff;
    outline: transparent;
  }
`;

// Form components
export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Wrapper and Login styled components
export const Wrapper1 = styled.section`
  width: 100vw;
  height: 100vh;
  text-align: center;
  align-items: center;

  @media (min-width: 800px) {
    display: flex;
    justify-content: space-between;
  }
`;

export const WrapperLogin = styled.div`
  border: 1px solid #ccc;
  margin: 10% auto;
  width: 20em;
  border-radius: 10px;
  box-shadow: 0px 0px 5px #ccc;

  &:focus {
    border: 1px solid #5effff;
    outline: transparent;
  }

  @media (min-width: 800px) {
    margin: 30% auto;
  }
`;

export const SectionLogin = styled.section`
  @media (min-width: 800px) {
    width: 40%;
    position: center;
  }
`;

export const Header = styled.header`
  margin: 25px 0;
`;

export const Span = styled.span`
  font-weight: 700;
  color: ${(props) => props.theme.blue};
  cursor: pointer;
  font-family: "Comic Sans MS", cursive;
`;

export const Link = styled.a`
  text-decoration: none;
  color: #224deb;
`;

export const SideImageWrapper = styled.div`
  display: none;

  @media (min-width: 800px) {
    display: block;
    height: 100vh;
    width: 60%;
    display: inline-block;
    background: url(${BackgroundImg});
    background-repeat: no-repeat;
    background-size: 90%;
    background-position: center;
  }
`;

// Define the Login component
const Login = ({ signup }) => {
  // Access setUser function from UserContext
  const { setUser } = useContext(UserContext);
  
  // Create two input hooks for email and password
  const email = useInput("");
  const password = useInput("");
  
  // Create history object to use with useHistory hook
  const history = useHistory();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if email and password fields are filled out
    if (!email.value || !password.value) {
      return toast.error("Please fill in both the fields");
    }

    // Construct request body object
    const body = { email: email.value, password: password.value };

    try {
      // Send login request to server and store token in localStorage
      const { token } = await client("/auth/login", { body });
      localStorage.setItem("token", token);
    } catch (err) {
      // Display error message if login request fails
      return toast.error(err.message);
    }
    
    // Send request to server for user data and store in localStorage
    const user = await client("/auth/me");
    localStorage.setItem("user", JSON.stringify(user.data));
    
    // Update user context and display success message
    setUser(user.data);
    toast.success("Login successful");

    // Reset email and password inputs and redirect to home page
    email.setValue("");
    password.setValue("");
    history.push('/');
  };

  // Render login form with associated components
  return (
    <Wrapper1 onSubmit={handleLogin}>
      <SideImageWrapper></SideImageWrapper>
      <SectionLogin>
        <Title>Welcome to our website!</Title>
        <WrapperLogin>
          <Header>
            <img className="nav-logo" src={logo_quiz} alt="logo" style={{ maxWidth: "30%", maxHeight: "15%" }} />
          </Header>
          <form>
            <FormWrapper>
              <InputWrapper1>
                <Label>Email</Label>
                <Input type="email" value={email.value} onChange={email.onChange} placeholder="IT5007@gmail.com" />
              </InputWrapper1>
              <InputWrapper1>
                <Label>Password</Label>
                <Input type="password" value={password.value} onChange={password.onChange} placeholder="mypassword" />
              </InputWrapper1>
              <ButtonGreen type="submit" className="login-btn" style={{ marginTop: '2rem' }}>Log In</ButtonGreen>
            </FormWrapper>
          </form>
          <div>
            <p style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Don't have an account? 
              <Span>
                {/* Display sign up link with associated function */}
                <span onClick={signup}>  Sign up</span>
              </Span>
            </p>
           </div>
        </WrapperLogin>
      </SectionLogin>      
    </Wrapper1>
  );
};

export default Login;
