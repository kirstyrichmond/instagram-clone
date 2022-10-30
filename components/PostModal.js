import React from "react";
import { useRecoilState } from "recoil";
import Modal from "react-modal";
import selectedPostState from "../atoms/selectedPostAtom.js";
import Post from "./Post.js";

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
    width: "84vw",
    height: "80%",
  },
  overlay: {
    backgroundColor: "rgb(27 26 26 / 70%)",
  },
};

const PostModal = ({ openPostModal, setOpenPostModal }) => {
  const [selectedPost, setSelectedPost] = useRecoilState(selectedPostState);

  return (
    <Modal
      isOpen={openPostModal}
      onRequestClose={() => setOpenPostModal(false)}
      ariaHideApp={false}
      style={customStyles}
      contentLabel="Post"
      shouldCloseOnOverlayClick
    >
      <div className="overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
        <Post
          id={selectedPost?.id}
          username={selectedPost?.data().username}
          userImg={selectedPost?.data().profileImg}
          img={selectedPost?.data().image}
          caption={selectedPost?.data().caption}
        />
      </div>
    </Modal>
  );
};

export default PostModal;
