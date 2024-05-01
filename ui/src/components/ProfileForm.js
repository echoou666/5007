import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import Button from "../styles/ButtonBlue";
import Avatar from "../styles/Avatar";
import useInput from "../hooks/useInput";
import { UserContext } from "../context/UserContext";
import { uploadImage } from "../utils";
import { client } from "../utils";

// Create a styled component for the profile form wrapper
export const Wrapper = styled.div`
  padding: 1rem;
  margin-top: 1rem;
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1));
  border-radius: 3px;

  img {
    cursor: pointer;
    margin-right: 50px;
  }

  .input-group {
    margin-top: 2rem;
  }

  .input-group > label {
    display: inline-block;
    width: 100px;
  }

  input,
  textarea {
    padding: 0.6rem 1rem;
    font-family: "Fira Sans", sans-serif;
    font-size: 1rem;
    border-radius: 10px;
    border: 3px solid ${(props) => props.theme.borderColor};
    width: 500px;
  }

  .textarea-group {
    display: flex;
  }

  .change-avatar {
    display: flex;
  }

  input[id="change-avatar"],
  input[id="change-avatar-link"] {
    display: none;
  }

  span {
    color: ${(props) => props.theme.blue};
    cursor: pointer;
  }

  button {
    margin-top: 1.5rem;
    margin-left: 30rem;
    margin-bottom: 0rem;
  }

  @media screen and (max-width: 550px) {
    width: 100%;

    .input-group {
      display: flex;
      flex-direction: column;
    }

    label {
      padding-bottom: 0.5rem;
      font-size: 1rem;
    }
  }

  @media screen and (max-width: 430px) {
    input,
    textarea {
      width: 99%;
    }
  }
`;

// Create a functional component for the profile form
const ProfileForm = () => {
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);
  const [newAvatar, setNewAvatar] = useState("");

  // Create custom hooks for form inputs
  const fullname = useInput(user.fullname);
  const username = useInput(user.username);
  const bio = useInput(user.bio);
  const website = useInput(user.website);

  // Handle image upload
  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      uploadImage(e.target.files[0]).then((res) =>
        setNewAvatar(res.secure_url)
      );
    }
  };

  // Handle profile edit form submission
  const handleEditProfile = (e) => {
    e.preventDefault();

    // Validate that name and username fields are not empty
    if (!fullname.value) {
      return toast.error("The name field should not be empty");
    }

    if (!username.value) {
      return toast.error("The username field should not be empty");
    }

    // Construct the request body for the PUT request
    const body = {
      fullname: fullname.value,
      username: username.value,
      bio: bio.value,
      website: website.value,
      avatar: newAvatar || user.avatar,
    };

    client("/users", { method: "PUT", body })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        history.push(`/${body.username || user.username}`);
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <Wrapper>
      <form onSubmit={handleEditProfile}>
        <div className="input-group change-avatar">
          <div>
            <label htmlFor="change-avatar">
              <Avatar
                lg
                src={newAvatar ? newAvatar : user.avatar}
                alt="avatar"
              />
            </label>
            <input
              id="change-avatar"
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
            />
          </div>
          <div className="change-avatar-meta">
            <h1>{user.username}</h1>
            <label htmlFor="change-avatar-link">
              <span>Change Profile Photo</span>
            </label>
            <input
              id="change-avatar-link"
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="bold">Name</label>
          <input
            type="text"
            value={fullname.value}
            onChange={fullname.onChange}
          />
        </div>

        <div className="input-group">
          <label className="bold">Username</label>
          <input
            type="text"
            value={username.value}
            onChange={username.onChange}
          />
        </div>

        <div className="input-group">
          <label className="bold">Website</label>
          <input
            type="text"
            value={website.value}
            onChange={website.onChange}
          />
        </div>

        <div className="input-group textarea-group">
          <label className="bold">Bio</label>
          <textarea
            cols="10"
            value={bio.value}
            onChange={bio.onChange}
          ></textarea>
        </div>
        <>
        <Button>Submit</Button>
        </>
      </form>
    </Wrapper>
  );
};

export default ProfileForm;
