import React, { useState,useRef } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import LikeQuestion from "./LikeQuestion";
import SaveQuestion from "./SaveQuestion";
import Discussion from "./Discussion";
import Modal from "./Modal";
import useInput from "../hooks/useInput";
import DeleteQuestion from "./DeleteQuestion";
import Avatar from "../styles/Avatar";
import { client } from "../utils";
import { timeSince } from "../utils";
import { MoreIcon, CommentIcon, InboxIcon } from "./Icons";
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';


const ModalContentWrapper = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  text-align: center;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);

  span:last-child {
    border: none;
  }

  span {
    display: block;
    padding: 1rem 0;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
  }
`;


export const ModalContent = ({ hideGotoQuestion, questionId, closeModal }) => {
  const history = useHistory();

  const handleGoToQuestion = () => {
    closeModal();
    history.push(`/p/${questionId}`);
  };

  return (
    <ModalContentWrapper>
      <span className="danger" onClick={closeModal}>
        Cancel
      </span>
      <DeleteQuestion questionId={questionId} closeModal={closeModal} goToHome={true} />
      {!hideGotoQuestion && <span onClick={handleGoToQuestion}>Check Details</span>}
    </ModalContentWrapper>
  );
};


export const QuestionWrapper = styled.div`
  width: 800px;
  background: ${(props) => props.theme.pink}; /* 修改背景颜色为粉色 */
  border: none;
  border-radius: 20px; /* 修改圆角为20px */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
  font-family: 'Comic Sans MS', cursive; /* 修改字体为 Comic Sans MS */

  .question-header-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .question-header {
    display: flex;
    align-items: center;
    padding: 1rem;
  }

  .question-header h3 {
    cursor: pointer;
    font-size: 1.5rem; /* 修改标题字体大小为1.5rem */
  }

  .question-img {
    width: 100%;
    height: 100%;
  }

  .question-actions {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    padding-bottom: 0.2rem;
  }

  .question-actions svg:last-child {
    margin-left: auto;
  }

  svg {
    margin-right: 1rem;
  }

  .likes-title-discussions {
    padding: 1rem;
    padding-top: 0.3rem;
  }

  .username {
    padding-right: 0.3rem;
  }

  .view-discussions {
    color: ${(props) => props.theme.secondaryColor};
    cursor: pointer;
  }

  textarea {
    height: 100%;
    width: 100%;
    border: none;
    border-top: 1px solid ${(props) => props.theme.borderColor};
    resize: none;
    padding: 1rem 0 0 1rem;
    font-size: 1rem;
    font-family: 'Comic Sans MS', cursive; /* 修改输入框字体为 Comic Sans MS */
  }

  @media screen and (max-width: 690px) {
    width: 99%;
  }
`;


const Question = ({ question }) => {
  const discussion = useInput("");
  const history = useHistory();
  
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  const [newComments, setNewComments] = useState([]);
  const [likesState, setLikes] = useState(question.likesCount);

  const incLikes = () => setLikes(likesState + 1);
  const decLikes = () => setLikes(likesState - 1);
  const questionUrlRef = useRef(window.location.href); // 获取当前 question 的网址
  const handleCopyUrl = () => {
        toast.success('URL copied to clipboard');
    };

  const handleAddComment = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();

      client(`/questions/${question._id}/discussions`, {
        body: { text: discussion.value },
      }).then((resp) => setNewComments([...newComments, resp.data]));

      discussion.setValue("");
    }
  };


  return (
    <QuestionWrapper>
      <div className="question-header-wrapper">
        <div className="question-header">
          <Avatar
            className="pointer"
            src={question.user?.avatar}
            alt="avatar"
            onClick={() => history.push(`/${question.user?.username}`)}
          />
          <h3
            className="pointer"
            onClick={() => history.push(`/${question.user?.username}`)}
          >
            {question.user?.username}
          </h3>
        </div>

        {showModal && (
          <Modal>
            <ModalContent questionId={question._id} closeModal={closeModal} />
          </Modal>
        )}
        {question.isMine && <MoreIcon onClick={() => setShowModal(true)} />}
      </div>
        <div>
            <div style={{padding: "10px", fontSize: "19px", fontWeight: "bold"}}><i>{question.title}</i></div>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <hr style={{border: "1px solid black", width:"98%"}} />
            </div>
                <div style={{padding: "5px", textAlign: "left", fontWeight: "bold"}}>Answer</div>
                <div style={{padding: "10px", fontSize: "16px"}}>{question.answer}</div>
            {question.files && (
                <div style={{ padding: "10px", maxWidth: "400px", maxHeight: "400px" }}>
                    {/* 设置图片的最大宽度和最大高度为 300px */}
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
            <span className="secondary" style={{padding:"7px"}}>{timeSince(question?.createdAt)} ago</span>

        </div>


        <div className="question-actions">
        <LikeQuestion
          isLiked={question.isLiked}
          questionId={question._id}
          incLikes={incLikes}
          decLikes={decLikes}
        />
        <CommentIcon onClick={() => history.push(`/p/${question._id}`)} />

        <CopyToClipboard text={questionUrlRef.current} onCopy={handleCopyUrl}>
            <InboxIcon />
        </CopyToClipboard>

        <SaveQuestion isSaved={question.isSaved} questionId={question._id} />

      </div>

      <div className="likes-title-discussions">
        {likesState !== 0 && (
          <span className="likes bold">
            {likesState} {likesState > 1 ? "likes" : "like"}
          </span>
        )}


        {question.discussionsCount > 2 && (
          <span
            onClick={() => history.push(`/p/${question._id}`)}
            className="view-discussions"
          >
            View all {question.discussionsCount} discussions
          </span>
        )}

        {question.discussions?.slice(0, 2).map((discussion) => (
          <Discussion key={discussion._id} hideavatar={true} discussion={discussion} />
        ))}

        {newComments.map((discussion) => (
          <Discussion key={discussion._id} hideavatar={true} discussion={discussion} />
        ))}


      </div>

      <div className="add-discussion">
        <textarea
          columns="3"
          placeholder="Leave some discussion~"
          value={discussion.value}
          onChange={discussion.onChange}
          onKeyDown={handleAddComment}
        ></textarea>
      </div>
    </QuestionWrapper>
  );
};

export default Question;
