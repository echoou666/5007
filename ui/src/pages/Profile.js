import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import QuestionPreview from "../components/QuestionPreview";
import ProfileHeader from "../components/ProfileHeader";
import Placeholder from "../components/Placeholder";
import Loader from "../components/Loader";
import { QuestionIcon, FilledBookmarkIcon } from "../components/Icons";
import { client } from "../utils";
import { toast } from "react-toastify";

// Define a styled component named Wrapper using styled-components
const Wrapper = styled.div`
  .profile-tab {
    display: flex;
    align-items: center;
    justify-content: right;
    margin: 3rem 0;
  }

  .profile-tab div {
    display: flex;
    cursor: pointer;
    margin-right: 5rem;
  }

  .profile-tab span {
    padding-left: 0.3rem;
  }

  .profile-tab svg {
    height: 30px;
    width: 35px;
  }

  hr {
    border: 1px solid ${(props) => props.theme.borderColor};
  }
`;

// Define a styled component named LeftTopWrapper that inherits from the Wrapper component and adds additional styles
const LeftTopWrapper = styled(Wrapper)`
  position: absolute;
  top: 110px;
  left: 20px;
`;

const Profile = () => {
  // Use the useParams hook to retrieve the "username" parameter from the URL
  const { username } = useParams();

  // Define states for profile information, loading state, and a deadend (i.e. page not found) state
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [deadend, setDeadend] = useState(false);

  // Define a state for the active tab, defaulting to "POSTS"
  const [tab, setTab] = useState("POSTS");

  // Fetch the user's profile information from the server when the component mounts or the username changes
  useEffect(() => {
    window.scrollTo(0, 0);
    client(`/users/${username}`)
      .then((res) => {
        setLoading(false);
        setDeadend(false);
        setProfile(res.data);
      })
      .catch((err) => setDeadend(true));
  }, [username]);

  // Fetch search data when the "handleQuery" event is emitted
  function fetchSearchData(username) {
    console.log('search is on')
    client(`/users/search?username=${username}`).then(({ data }) => {
      const [ info ] = data;
      console.log('info', info)
      setProfile(info)
    })
    setTimeout(() => toast.success("this search is success"), 3000);
  }

  // Subscribe to and unsubscribe from the "handleQuery" event when the component mounts and unmounts
  useEffect(() => {
    window.eventBus.on('handleQuery', fetchSearchData);
    return () => {
      window.eventBus.off('handleQuery', fetchSearchData);
    }
  }, []);

  // Render a loader if the page is still loading
  if (!deadend && loading) {
    return <Loader />;
  }

  // Render a placeholder if the page is not found
  if (deadend) {
    return (
      <Placeholder
        title="Sorry, this page isn't available"
        text="The link you followed may be broken, or the page may have been removed"
      />
    );
  }

  return (
    <LeftTopWrapper>
      <ProfileHeader profile={profile} />
      <hr />

      <div className="profile-tab">
        <div
          style={{ fontWeight: tab === "POSTS" ? "600" : "" }}
          onClick={() => setTab("POSTS")}
        >
          <QuestionIcon />
          <span>Q&A</span>
        </div>
        <div
          style={{ fontWeight: tab === "SAVED" ? "600" : "" }}
          onClick={() => setTab("SAVED")}
        >
          <FilledBookmarkIcon />
          <span>Marker</span>
        </div>
      </div>

      {tab === "POSTS" && (
        <>
          {profile?.questions?.length === 0 ? (
            <Placeholder
              title="Questions"
              text="Once you add a new question, they'll appear here"
              icon="question"
            />
          ) : (
          <>
            <h1>Q & A</h1>
            <QuestionPreview questions={profile?.questions} /></>
          )}
        </>
      )}

      {tab === "SAVED" && (
        <>
          {profile?.savedQuestions?.length === 0 ? (
            <Placeholder
              title="Marked"
              text="Save questions that you want to see again"
              icon="bookmark"
            />
          ) : (
            <>
              <h1>Marked</h1>
              <QuestionPreview questions={profile?.savedQuestions} />
            </>
          )}
        </>
      )}
    </LeftTopWrapper>
  );
};

export default Profile;
