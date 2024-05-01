import React, { useContext, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Modal from "./Modal";
import { FeedContext } from "../context/FeedContext";
import { client, uploadImage } from "../utils";
import { NewQuestionIcon } from "./Icons";

// Import OpenAI libraries
const { Configuration, OpenAIApi } = require('openai')

const NewQuestionWrapper = styled.div`
  .newquestion-header {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
  }

  .newquestion-header h3:first-child {
    color: ${(props) => props.theme.red};
  }

  h3 {
    cursor: pointer;
  }

  .newquestion-header h3:last-child {
    color: ${(props) => props.theme.blue};
  }

  textarea {
    height: 100%;
    width: 100%;
    font-family: "Fira Sans", sans-serif;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    resize: none;
  }

  .modal-content {
    width: 700px;
  }

  @media screen and (max-width: 780px) {
    .modal-content {
      width: 90vw;
    }
  }
`;

const NewQuestion = () => {
  const { feed, setFeed } = useContext(FeedContext); // Get feed and setFeed from context
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [answer, setAnswer] = useState('');
  const [tags, setTags] = useState('');
  const [imageSrc, setImageSrc] = useState("");
  const [questionImage, setQuestionImage] = useState("");

  // Set up OpenAI API
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Get OpenAI API key from environment variables
  });
  const openai = new OpenAIApi(configuration);

  // Handle input change for answer field
  const handleInputChange = (event) => {
    const { value } = event.target;
    setAnswer(value);
    event.target.style.height = "auto"; 
    event.target.style.height = `${event.target.scrollHeight}px`; 
  };

  // Handle submission of new question
  const handleSubmitQuestion = () => {
    console.log(title)
    if (!title) {
      return toast.error("Please write something");
    }

    setShowModal(false);

    const answer_ = answer;

    const newQuestion = {
      title,
      answer: answer_,
      tags,
      files: [questionImage]
    };

    // Clear form and submit new question to server
    setTitle("");
    setAnswer("");
    setTags("");
    setQuestionImage("");
    setImageSrc("");
    client(`/questions`, { body: newQuestion }).then((res) => {
      const question = res.data;
      question.isLiked = false;
      question.isSaved = false;
      question.isMine = true;
      setFeed([question, ...feed]); // Add new question to the beginning of the feed
      window.scrollTo(0, 0);
      window.eventBus.emit('submitSuccess') // Emit event for successful submission
      toast.success("Your question has been submitted successfully");
    });
  };

  // Handle file upload for question image
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file); 
    setImageSrc(imageUrl); 
    uploadImage(event.target.files[0]).then((res) => {
          setQuestionImage(res.secure_url);
      });

  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.includes("image")) { 
        const file = item.getAsFile(); 
        const imageUrl = URL.createObjectURL(file); 
        setImageSrc(imageUrl); 
        uploadImage(file).then((res) => {
          setQuestionImage(res.secure_url);
        });
        event.preventDefault(); 
        break;
      }
    }
  }

  const handleGenerateAnswer = async (caption, setCaption) => {
    const completeOptions = {
      model: 'text-davinci-003',
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: null,
      prompt: caption,
    };

  const response = await openai.createCompletion(completeOptions);
  if (response.data.choices) {
    setAnswer(response.data.choices[0].text);
    setCaption(caption);
  }
};

  return (
      <NewQuestionWrapper>
        <div onClick={() => setShowModal(true)}>
          <NewQuestionIcon />
        </div>
        {showModal && (
            <Modal>
              <div className="modal-content">
                <div className="newquestion-header">
                  <h3
                      onClick={() => setShowModal(false)}
                      style={{
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "#FF80AB",
                        marginRight: "1rem",
                        marginBottom: "0",
                        textDecoration: "underline",
                        transition: "color 0.3s ease-in-out",
                      }}
                  >
                    Cancel
                  </h3>

                  <h3
                      onClick={handleSubmitQuestion}
                      style={{
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "#4CAF50",
                        marginLeft: "1rem",
                        marginBottom: "0",
                        textDecoration: "underline",
                        transition: "color 0.3s ease-in-out",
                      }}
                  >
                    Add Question
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' , padding:"10px"}}>
                  <textarea
                      placeholder="Add question title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      style={{width: '610px',height:'30px'}} 
                  />
                  <button
                      style={{
                        width: "90px",
                        height: "50px",
                        borderRadius: "15px",
                        backgroundColor: "orange",
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease-in-out",
                      }}
                      onClick={() => handleGenerateAnswer(title, setTitle)}
                  >
                    Ask AI
                  </button>

                </div>
                <hr style={{ width: "96%", margin: "0 auto" }} />
                <div style={{padding:"10px"}}>
              <textarea style={{ height: "auto", minHeight: "100px", maxHeight: "300px", resize: "vertical" }}
                  placeholder="Add answer"
                  value={answer}
                  onChange={handleInputChange}
                  onPaste={handlePaste} 
              />
                  {imageSrc && <img src={imageSrc} alt="Pasted Image" style={{ maxWidth: "100%", maxHeight: "100%" }}/>} {/* 展示图片 */}
                  <div
                      style={{
                        padding: "10px",
                        borderRadius: "5px",
                        backgroundColor: "lightyellow",
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                        width:"140px",
                        marginLeft: "10px"
                      }}
                  >
                    <label htmlFor="fileUpload" style={{ cursor: "pointer" }}>
                      Upload Pictures
                    </label>
                    <input
                        type="file"
                        id="fileUpload"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                    />
                  </div>

                </div>
                <hr style={{ width: "96%", margin: "0 auto" }} />
                <div style={{padding:"5px"}}>
              <textarea style={{height:"100px"}}
                        placeholder="Add tags(use # to separate)"
                        value={tags}
                        onChange={(event) => setTags(event.target.value.toUpperCase())}
              />
                </div>
              </div>
            </Modal>
        )}
      </NewQuestionWrapper>
  );
};

export default NewQuestion;


