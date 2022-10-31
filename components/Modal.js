import React from "react";
import Modal from "react-modal";
import { signOut } from "next-auth/react";

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
    zIndex: "200",
  },
  overlay: {
    backgroundColor: "rgb(27 26 26 / 70%)",
  },
};

const ModalWrapper = ({
  title,
  action,
  openModal,
  setOpenModal,
  secondTitle,
}) => {
  return (
    <Modal
      isOpen={openModal}
      onRequestClose={() => setOpenModal(false)}
      ariaHideApp={false}
      style={customStyles}
      contentLabel={title}
      shouldCloseOnOverlayClick
    >
      <div className="px-10 py-5 bg-white cursor-pointer" onClick={action}>
        <h3 className="text-lg text-center">{title}</h3>
      </div>
      {secondTitle && (
        <div
          className="px-6 py-4 mx-4 bg-white border-t cursor-pointer"
          onClick={() =>
            signOut({ redirect: true, callbackUrl: process.env.NEXTAUTH_URL })
          }
        >
          <h3 className="text-lg text-center">{secondTitle}</h3>
        </div>
      )}
    </Modal>
  );
};

export default ModalWrapper;
