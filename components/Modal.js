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

  let __selectedPost = selectedPost

  console.log(__selectedPost, "<< selected post in MODAL");

  const {
    query: { id },
  } = router;

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
  }, [likes]);

  console.log(likes, "<< likes");

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
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
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
  };

  const uploadPost = async () => {
    if (loading) return;

    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      username: session.user.username,
      caption: captionRef.current.value,
      profileImg: session.user.image,
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

  // const displayPost = () => {
  //   return (
  //     <div className="bg-white my-7 border rounded-sm">
  //       {/* Header */}
  //       <div className="flex items-center p-5">
  //         <img
  //           className="rounded-full h-12 w-12 border p-1 mr-3 object-contain"
  //           src={selectedPost.profileImg}
  //           alt=""
  //         />
  //         <p className="flex-1 font-bold">{selectedPost.username}</p>
  //         <DotsHorizontalIcon className="h-5" />
  //       </div>

  //       {/* Image */}
  //       <img src={selectedPost.image} className="object-cover w-full" alt="" />

  //       {/* Buttons */}
  //       {session && (
  //         <div className="flex justify-between px-4 pt-4">
  //           <div className="flex space-x-4">
  //             {hasLiked ? (
  //               <HeartIconFilled
  //                 onClick={likePost}
  //                 className="btn text-red-500"
  //               />
  //             ) : (
  //               <HeartIcon onClick={likePost} className="btn" />
  //             )}
  //             <ChatIcon className="btn" />
  //             <PaperAirplaneIcon className="btn" />
  //           </div>
  //           <BookmarkIcon className="btn" />
  //         </div>
  //       )}

  //       {/* Caption */}
  //       <div className="p-5 truncate">
  //         {likes.length > 0 && (
  //           <p className="font-bold mb-1">{likes.length} likes</p>
  //         )}
  //         <span className="font-bold mr-1">{selectedPost.username} </span>
  //         {selectedPost.caption}
  //       </div>

  //       {/* Comments */}

  //       {comments.length > 0 && (
  //         <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
  //           {comments.map((comment) => (
  //             <div
  //               key={comment.id}
  //               className="flex items-center space-x-2 mb-3"
  //             >
  //               <img
  //                 className="h-7 rounded-full"
  //                 src={comment.data().userImage}
  //                 alt=""
  //               />
  //               <p className="text-sm flex-1">
  //                 <span className="font-bold pr-2">
  //                   {comment.data().username}
  //                 </span>
  //                 {comment.data().comment}
  //               </p>
  //               <Moment fromNow className="pr-5 text-xs">
  //                 {comment.data().timestamp?.toDate()}
  //               </Moment>
  //             </div>
  //           ))}
  //         </div>
  //       )}

  //       {/* Input box */}
  //       {session && (
  //         <form className="flex items-center p-4">
  //           <EmojiHappyIcon className="h-7" />
  //           <input
  //             type="text"
  //             value={comment}
  //             onChange={(e) => setComment(e.target.value)}
  //             className="border-none flex-1 focus:ring-0 outline-none"
  //             placeholder="Add a comment..."
  //           />
  //           <button
  //             type="submit"
  //             disabled={!comment.trim()}
  //             onClick={sendComment}
  //             className="font-semibold text-blue-400"
  //           >
  //             Post
  //           </button>
  //         </form>
  //       )}
  //     </div>
  //   );
  // };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 my-10 overflow-hidden"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity " />
          </Transition.Child>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
            &#8203
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            {id === session?.user.username ? (
              <div className=" bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-[75%] mx-auto ">
                <Post
                  id={__selectedPost?.id}
                  username={__selectedPost?.data().username}
                  userImg={__selectedPost?.data().profileImg}
                  img={__selectedPost?.data().image}
                  caption={__selectedPost?.data().caption}
                />
                {/* <div className="bg-white">
                  <div className="flex ">
                    
                    <div className="w-11/12 bg-black max-h-[900px] max-w-[900px]">
                      <Image
                        src={selectedPost?.image}
                        className="object-contain "
                        width={100}
                        height={100}
                        layout="responsive"
                        alt=""
                      />
                    </div>
                    <div className="bg-white rounded-sm mt-5 w-[34%]">
                      <div className="flex items-center p-5 h-[10%]">
                        <img
                          className="rounded-full h-12 w-12 border p-1 mr-3 object-contain"
                          src={selectedPost?.profileImg}
                          alt=""
                        />
                        <p className="flex-1 font-bold">
                          {selectedPost?.username}
                        </p>
                        <DotsHorizontalIcon className="h-5" />
                      </div>

                      <div className="p-5 pt-0 truncate text-xs">
                        {likes.length > 0 && (
                          <p className="font-bold mb-1">{likes.length} likes</p>
                        )}
                        <span className="font-semibold mr-1 text-xs">
                          {selectedPost?.username}
                        </span>
                        {selectedPost?.caption}
                      </div>

                      <div className="h-[70%]">
                        {comments.length > 0 && (
                          <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
                            {comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="flex items-center space-x-2 mb-3"
                              >
                                <img
                                  className="h-7 rounded-full"
                                  src={comment.data().userImage}
                                  alt=""
                                />
                                <p className="text-sm flex-1">
                                  <span className="font-bold pr-2">
                                    {comment.data().username}
                                  </span>
                                  {comment.data().comment}
                                </p>
                                <Moment fromNow className="pr-5 text-xs">
                                  {comment.data().timestamp?.toDate()}
                                </Moment>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="h-[25%]">
                        {session && (
                          <div className="flex justify-between px-4 pt-4">
                            <div className="flex space-x-4 ">
                              {hasLiked ? (
                                <HeartIconFilled
                                  onClick={likePost}
                                  className="btn text-red-500"
                                />
                              ) : (
                                <HeartIcon onClick={likePost} className="btn" />
                              )}
                              <ChatIcon className="btn" />
                              <PaperAirplaneIcon className="btn" />
                            </div>
                            <BookmarkIcon className="btn" />
                          </div>
                        )}

                        {session && (
                          <form className="flex items-center flex-end p-4">
                            <EmojiHappyIcon className="h-7" />
                            <input
                              type="text"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="border-none flex-1 focus:ring-0 outline-none"
                              placeholder="Add a comment..."
                            />
                            <button
                              type="submit"
                              disabled={!comment.trim()}
                              onClick={sendComment}
                              className="font-semibold text-blue-400"
                            >
                              Post
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              */}
              </div>
            ) : (
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                {selectedFile ? (
                  <img
                    src={selectedFile}
                    onClick={() => setSelectedFile(null)}
                    alt="preview selected image"
                    className="w-full object-contain cursor-pointer"
                  />
                ) : (
                  <>
                    <div
                      onClick={() => filePickerRef.current.click()}
                      className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer max-w-"
                    >
                      <CameraIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-medium text-gray-900"
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
                            className="border-none focus:ring-0 w-full text-center"
                            ref={captionRef}
                            placeholder="Please enter a caption..."
                          />
                        </div>
                        <div className="mt-5 sm:mt-6">
                          <button
                            type="button"
                            disabled={!selectedFile}
                            onClick={uploadPost}
                            className="inline-flex justify-center w-full rounded-md border border-transparent show-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
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
