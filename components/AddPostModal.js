import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import modalState from "../atoms/modalAtom.js";
import { CameraIcon } from "@heroicons/react/outline";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadString } from "firebase/storage";
import { useSession } from "next-auth/react";
import Modal from "react-modal";

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
    width: "400px",
  },
  overlay: {
    backgroundColor: "rgb(27 26 26 / 70%)",
  },
};

const AddPostModal = () => {
  const { data: session } = useSession();
  const [openModal, setOpenModal] = useRecoilState(modalState);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const uploadPost = async () => {
    if (loading) return;

    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      userId: session.user.id,
      username: session.user.username,
      caption: captionRef.current.value,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    });
    console.log("New doc added with ID", docRef.id);

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(async () => {
      const downloadURL = await getDownloadURL(imageRef);

      await updateDoc(doc(db, "posts", docRef.id), {
        image: downloadURL,
      });
    });
    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  return (
    <Modal
      isOpen={openModal}
      onRequestClose={() => setOpenModal(false)}
      ariaHideApp={false}
      style={customStyles}
      contentLabel="Add Post"
      shouldCloseOnOverlayClick
    >
      <div className="inline-block w-full overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl lg:px-4 lg:pt-5 lg:pb-4 sm:p-6">
        {selectedFile ? (
          <>
            <img
              src={selectedFile}
              onClick={() => setSelectedFile(null)}
              alt="preview selected image"
              className="object-contain w-full cursor-pointer"
            />
            <div className="mt-2">
              <input
                className="w-full text-center border-none focus:ring-0"
                ref={captionRef}
                placeholder="Please enter a caption..."
              />
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                disabled={!selectedFile}
                onClick={uploadPost}
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md show-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
              >
                {loading ? "Uploading..." : "Upload post"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => filePickerRef.current.click()}
              className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full cursor-pointer max-w-"
            >
              <CameraIcon className="w-6 h-6 text-red-600" aria-hidden="true" />
            </div>
            <div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Upload a photo
                </h3>
                <div>
                  <input
                    ref={filePickerRef}
                    type="file"
                    hidden
                    onChange={addImageToPost}
                  />
                </div>

                <div className="mt-2">
                  <input
                    className="w-full text-center border-none focus:ring-0"
                    ref={captionRef}
                    placeholder="Please enter a caption..."
                  />
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    disabled={!selectedFile}
                    onClick={uploadPost}
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md show-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
                  >
                    {loading ? "Uploading..." : "Upload post"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddPostModal;
