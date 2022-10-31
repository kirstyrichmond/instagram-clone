import React from "react";
import { useRecoilState } from "recoil";
import Modal from "react-modal";
import selectedPostState from "../atoms/selectedPostAtom.js";
import Post from "./Post.js";

const PostModal = ({ openPostModal, setOpenPostModal }) => {
  const [selectedPost, setSelectedPost] = useRecoilState(selectedPostState);
  let modalWidth;
  let modalHeight;

  if (typeof window !== "undefined") {
    modalWidth = window.innerWidth < 744 ? "84vw" : "50%";
    modalHeight = window.innerWidth < 744 ? "80%" : "auto";
  }

  return (
    <Modal
      isOpen={openPostModal}
      onRequestClose={() => setOpenPostModal(false)}
      ariaHideApp={false}
      style={{
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
          width: modalWidth,
          height: modalHeight,
        },
        overlay: {
          backgroundColor: "rgb(27 26 26 / 70%)",
        },
      }}
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
