import React, { useRef, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import LikeQuestion from "../components/LikeQuestion";
import SaveQuestion from "../components/SaveQuestion";
import Discussion from "../components/Discussion";
import Placeholder from "../components/Placeholder";
import Avatar from "../styles/Avatar";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { ModalContent } from "../components/Question";
import useInput from "../hooks/useInput";
import { client } from "../utils";
import { timeSince } from "../utils";
import { MoreIcon, CommentIcon, InboxIcon } from "../components/Icons";
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 70% 1fr;
  border-radius: 15px; /* 添加四角弧度 */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  // height: 140%; /* 设置高度为100% */
  // width: 100%; /* 设置宽度为100% */
  .question-info {
    border: 1px solid ${(props) => props.theme.borderColor};
  }

  .question-header-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
  }

  .question-header {
    display: flex;
    align-items: center;
  }

  .question-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .question-actions-stats {
    padding: 1rem;
    padding-bottom: 0.1rem;
  }

  .question-actions {
    display: flex;
    align-items: center;
    padding-bottom: 0.5rem;
  }

  .question-actions svg:last-child {
    margin-left: auto;
  }

  .discussions {
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    padding: 1rem;
    height: 300px;
    overflow-y: scroll;
    scrollbar-width: none;
  }

  .discussions::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  svg {
    margin-right: 1rem;
  }

  textarea {
    height: 100%;
    width: 100%;
    background: ${(props) => props.theme.bg};
    border: none;
    border-top: 1px solid ${(props) => props.theme.borderColor};
    resize: none;
    padding: 1rem 0 0 1rem;
    font-size: 1rem;
    font-family: "Fira Sans", sans-serif;
  }

  @media screen and (max-width: 840px) {
    display: flex;
    flex-direction: column;

    .discussions {
      height: 100%;
    }
  }
`;


const DetailedQuestion = () => {
  const history = useHistory();
  const { questionId } = useParams();

  const discussion = useInput("");
  const commmentsEndRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  const [loading, setLoading] = useState(true);
  const [deadend, setDeadend] = useState(false);
  const [question, setQuestion] = useState({});

  const [likesState, setLikes] = useState(0);
  const [discussionsState, setComments] = useState([]);

  const incLikes = () => setLikes(likesState + 1);
  const decLikes = () => setLikes(likesState - 1);

  const scrollToBottom = () =>
    commmentsEndRef.current.scrollIntoView({ behaviour: "smooth" });

  const handleAddComment = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();

      client(`/questions/${question._id}/discussions`, {
        body: { text: discussion.value },
      }).then((resp) => {
        setComments([...discussionsState, resp.data]);
        scrollToBottom();
      });

      discussion.setValue("");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    client(`/questions/${questionId}`)
      .then((res) => {
        setQuestion(res.data);
        setComments(res.data.discussions);
        setLikes(res.data.likesCount);
        setLoading(false);
        setDeadend(false);
      })
      .catch((err) => setDeadend(true));
  }, [questionId]);

  if (!deadend && loading) {
    return <Loader />;
  }

  if (deadend) {
    return (
      <Placeholder
        title="Sorry, this page isn't available"
        text="The link you followed may be broken, or the page may have been removed"
      />
    );
  }


  return (
    <Wrapper>
      <div style={{marginTop:"20px"}}>
        <div style={{padding: "10px", fontSize: "17px", fontWeight: "bold"}}><i>{question.title}</i></div>
        <hr style={{border: "1px solid black"}} />
        <div style={{padding: "5px", textAlign: "left", fontWeight: "bold"}}>Answer</div>
        <div style={{padding: "10px", fontSize: "16px"}}>{question.answer}</div>
        {question.files && (
            <div style={{ padding: "10px", maxWidth: "100%", maxHeight: "100%" }}>
              {question.files?.length > 0 && question.files[0] !== "" && (
                  <img src={question.files[0]} alt="Question Image" style={{ width: "100%", height: "100%" }} />
              )}
            </div>
        )}
        <div style={{ padding: "5px", textAlign: "left", fontWeight: "bold" }}>
          Topic:             {question.tags.map((tag, index) => (
            <span key={index}>
                      <Link
                          to={{ pathname: "/browse", search: `?tag=${encodeURIComponent(tag)}` }}
                          style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {`#${tag}`}
                      </Link>
              {index < question.tags.length - 1 ? " " : ""}
                        </span>
        ))}
        </div>

      </div>

      <div className="question-info">
        <div className="question-header-wrapper">
          <div className="question-header">
            <Avatar
              onClick={() => history.push(`/${question.user?.username}`)}
              className="pointer avatar"
              src={question.user?.avatar}
              alt="avatar"
            />

            <h3
              className="pointer"
              onClick={() => history.push(`/${question.user?.username}`)}
            >
              {question.user?.username}
            </h3>
          </div>
          {question.isMine && <MoreIcon onClick={() => setShowModal(true)} />}

          {showModal && (
            <Modal>
              <ModalContent
                questionId={question._id}
                hideGotoQuestion={true}
                closeModal={closeModal}
              />
            </Modal>
          )}
        </div>

        <div className="discussions">
          {discussionsState.map((discussion) => (
            <Discussion key={discussion._id} discussion={discussion} />
          ))}
          <div ref={commmentsEndRef} />
        </div>

        <div className="question-actions-stats">
          <div className="question-actions">
            <LikeQuestion
              isLiked={question?.isLiked}
              questionId={question?._id}
              incLikes={incLikes}
              decLikes={decLikes}
            />
            <CommentIcon />
            <InboxIcon />
            <SaveQuestion isSaved={question?.isSaved} questionId={question?._id} />
          </div>

          {likesState !== 0 && (
            <span className="likes bold">
              {likesState} {likesState > 1 ? "likes" : "like"}
            </span>
          )}
        </div>

        <span
          style={{ display: "block", padding: "0 1rem", paddingBottom: "1rem" }}
          className="secondary"
        >
          {timeSince(question.createdAt)} ago
        </span>

        <div className="add-discussion">
          <textarea
            columns="2"
            placeholder="Add a Discussion"
            value={discussion.value}
            onChange={discussion.onChange}
            onKeyDown={handleAddComment}
          ></textarea>
        </div>
      </div>
    </Wrapper>
  );
};

export default DetailedQuestion;