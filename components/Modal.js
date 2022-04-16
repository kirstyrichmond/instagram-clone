import React, { Fragment, useRef, useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState } from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import {
  BookmarkIcon,
  CameraIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/outline";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadString } from "firebase/storage";
import { useSession } from "next-auth/react";
import { selectedPostState } from "../atoms/selectedPostAtom";
import { useRouter } from "next/router";
import Post from "./Post";
import Posts from "./Posts";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import Moment from "react-moment";
import Image from "next/image";

const Modal = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [selectedPost, setSelectedPost] = useRecoilState(selectedPostState);
  const router = useRouter();
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  let __selectedPost = selectedPost;

  console.log(__selectedPost, "<< selected post in MODAL");

  const {
    query: { id },
  } = router;

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === session?.uid) !== -1);
  }, [likes]);

  console.log(likes, "<< likes");

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.uid), {
        username: session.user.username,
      });
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: session.username,
      userImage: session.image,
      timestamp: serverTimestamp(),
    });
  };

  const uploadPost = async () => {
    if (loading) return;

    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      username: session.username,
      caption: captionRef.current.value,
      profileImg: session.image,
      timestamp: serverTimestamp(),
    });
    console.log("New doc added with ID", docRef.id);

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);

        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      }
    );
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
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 my-10 overflow-hidden container h-[100%]"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>
          {/* <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
            &#8203
          </span> */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            {id === session?.username ? (
              <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-[75%] mx-auto mb-[250px] md:mt-[30%] lg:mt-[10%] xl:my-[2%] xl:mr-[5%]">
                <Post
                  id={__selectedPost?.id}
                  username={__selectedPost?.data().username}
                  userImg={__selectedPost?.data().profileImg}
                  img={__selectedPost?.data().image}
                  caption={__selectedPost?.data().caption}
                />
              </div>
            ) : (
              <div className="inline-block w-full max-w-sm my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl lg:px-4 lg:pt-5 lg:pb-4 sm:p-6">
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
                      <CameraIcon
                        className="w-6 h-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Upload a photo
                        </Dialog.Title>
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
            )}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
