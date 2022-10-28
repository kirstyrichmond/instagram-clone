import React from "react";
import Modal from "react-modal";
import {
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase.js";

const customStyles = {
  content: {
    top: "54%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0",
    borderRadius: "12px",
    border: "none",
    zIndex: "100",
  },
  overlay: {
    backgroundColor: "rgb(27 26 26 / 70%)",
  },
};

const EditPostModal = ({ isOpen, handleClose, id }) => {
  const deletePost = async () => {
    await deleteDoc(doc(db, "posts", id));
    handleClose(!isOpen);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => handleClose(!isOpen)}
      ariaHideApp={false}
      style={customStyles}
      contentLabel="Edit Post Modal"
      shouldCloseOnOverlayClick
    >
      <div className="px-10 py-5 bg-white cursor-pointer" onClick={deletePost}>
        <h3 className="text-lg text-center">Delete Post</h3>
      </div>
    </Modal>
  );
};

export default EditPostModal;
