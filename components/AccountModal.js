import React from "react";
import Modal from "react-modal";
import {
  deleteDoc,
  doc,
} from "firebase/firestore";
import db from "../firebase.js";
import { useRouter } from 'next/router'

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

const AccountModal = ({ isOpen, handleClose, id }) => {
  const router = useRouter()

  const deleteAccount = async () => {
    await deleteDoc(doc(db, "users", id));
    handleClose(!isOpen);
    router.push('/')
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => handleClose(!isOpen)}
      ariaHideApp={false}
      style={customStyles}
      contentLabel="Account Modal"
      shouldCloseOnOverlayClick
    >
      <div className="px-10 py-5 bg-white cursor-pointer" onClick={deleteAccount}>
        <h3 className="text-lg text-center">Delete Account</h3>
      </div>
    </Modal>
  );
};

export default AccountModal