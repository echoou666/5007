import React, { useContext } from "react";
import { toast } from "react-toastify";
import { client } from "../utils";
import { Wrapper1 } from "./Login";
import { InputWrapper1 } from "./Login";
import { SideImageWrapper } from "./Login";
import { Span } from "./Login";
import { WrapperLogin } from "./Login";
import { FormWrapper } from "./Login";
import { Header } from "./Login";
import { SectionLogin } from "./Login"
import { Label } from "./Login";
import { Input } from "./Login";
import useInput from "../hooks/useInput";
import { UserContext } from "../context/UserContext";
import { useHistory } from "react-router-dom";
import logo_quiz from "../assets/logo_quiz.png";
import ButtonGreen from "../styles/ButtonGreen";

const Signup = ({ login }) => {
  const history = useHistory();
  const { setUser } = useContext(UserContext);
  const email = useInput("");
  const fullname = useInput("");
  const username = useInput("");
  const password = useInput("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.value || !password.value || !username.value || !fullname.value) {
      return toast.error("Please fill in all the fields");
    }

    if (username.value === "browse") {
      return toast.error(
        "The username you entered is not acceptable, try again"
      );
    }
    if (username.value === "study") {
      return toast.error(
          "The username you entered is not acceptable, try again"
      );
    }

    const re = /^[a-z0-9]+$/i;
    if (re.exec(username.value) === null) {
      return toast.error(
        "The username you entered is not acceptable, try again"
      );
    }

    const body = {
      email: email.value,
      password: password.value,
      username: username.value,
      fullname: fullname.value,
    };

    try {
      const { token } = await client("/auth/signup", { body });
      localStorage.setItem("token", token);
    } catch (err) {
      return toast.error(err.message);
    }

    const user = await client("/auth/me");
    setUser(user.data);
    localStorage.setItem("user", JSON.stringify(user.data));

    fullname.setValue("");
    username.setValue("");
    password.setValue("");
    email.setValue("");
    console.log(localStorage)
    //window.location.reload()
    window.location.href = "/";
  };

  return (
    <Wrapper1 onSubmit={handleLogin}>
      <SideImageWrapper></SideImageWrapper>
      <SectionLogin>
        <WrapperLogin>
          <Header>
            <img className="nav-logo" src={logo_quiz} alt="logo" style={{ maxWidth: "30%", maxHeight: "15%" }} />
          </Header>
          <form>
            <FormWrapper>
            <InputWrapper1>
              <Label>Email</Label>
              <Input type="email" value={email.value} onChange={email.onChange} placeholder="Email" />
            </InputWrapper1>
            <InputWrapper1>
              <Label>Full Name</Label>
              <Input type="text" value={fullname.value} onChange={fullname.onChange} placeholder="Full Name" />
            </InputWrapper1>
            <InputWrapper1>
              <Label>Username</Label>
              <Input type="text" value={username.value} onChange={username.onChange} placeholder="Username" />
            </InputWrapper1>
            <InputWrapper1>
              <Label>Password</Label>
              <Input type="password" value={password.value} onChange={password.onChange} placeholder="Password" />
            </InputWrapper1>

              <ButtonGreen  type="submit"  className="signup-btn" style={{ marginTop: '2rem' }}>Sign up</ButtonGreen>
              </FormWrapper>
          </form>
          <div>
            <p style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Already have an account?
              <Span>
                <span onClick={login}>  Login</span>
              </Span> 
            </p>
          </div>
      </WrapperLogin>
    </SectionLogin>
    </Wrapper1>
  );
};

export default Signup;
