import React from "react";
import styled, { keyframes } from "styled-components";

// Define a keyframe animation for opening the modal
const openModal = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

// Define a styled component for the modal wrapper
export const ModalWrapper = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* translucent black background */
  z-index: 1000;
  overflow: hidden;
  animation: ${openModal} 0.5s ease-in-out; /* apply the keyframe animation */

  .modal-content {
    background: white;
    border-radius: 4px;
    margin: auto;
    justify-self: center;
  }

  .modal-content img.question-preview {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

// Define a functional component for the modal itself
const Modal = ({ children }) => {
  return (
    <ModalWrapper>
      <div className="modal-content">{children}</div>
    </ModalWrapper>
  );
};

export default Modal;
