import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import Moment from "react-moment";
import { useRouter } from "next/router";
import Image from "next/image";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  PaperAirplaneIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import ModalWrapper from "./Modal";

const Post = ({ id, username, userImg, img, caption }) => {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  useEffect(() => {
    const userLiked = () => {
      const usersLiked = likes.map((user) => user.data().username);
      return usersLiked.includes(session?.user.username);
    };
    setHasLiked(userLiked);
    userLiked();
  }, [likes]);

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.username));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.username), {
        username: session.user.username,
      });
      setHasLiked(true);
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "posts", id, "comments"), {
      userId: session.user.id,
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
  };

  const deletePost = async () => {
    await deleteDoc(doc(db, "posts", id));
    setOpenModal(false);
  };

  return router.pathname === "/" ? (
    <>
      <ModalWrapper
        title={"Delete Post"}
        action={deletePost}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <div className={`bg-white lg:mt-1 border-t md-border rounded-sm`}>
        <div className="flex items-center py-2 pl-2 pr-4 cursor-pointer md:py-3">
          <img
            className="object-contain w-12 h-12 p-1 mr-3 border rounded-full"
            src={userImg}
            alt=""
          />
          <p className="flex-1 font-semibold">{username}</p>
          <DotsHorizontalIcon
            className="h-5 cursor-pointer"
            onClick={() =>
              username === session?.user.username && setOpenModal(true)
            }
          />
        </div>
        <img src={img} className="object-cover w-full" alt="" />
        {session && (
          <div className="flex justify-between px-4 pt-4">
            <div className="flex space-x-4">
              {hasLiked ? (
                <HeartIconFilled
                  onClick={likePost}
                  className="text-red-500 btn"
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
        <div className="p-3 truncate md:p-5">
          {likes.length > 0 && (
            <p className="mb-1 font-bold">
              {likes.length} {likes.length === 1 ? "like" : "likes"}
            </p>
          )}
          <span className="mr-1 font-bold">{username} </span>
          {caption}
        </div>
        {comments.length > 0 && (
          <div className="h-20 ml-6 overflow-y-scroll break-all scrollbar-thumb-black scrollbar-thin">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-center mb-3 space-x-2"
              >
                <img
                  className="rounded-full h-7"
                  src={comment.data().userImage}
                  alt=""
                />
                <p className="flex flex-col flex-1 text-sm">
                  <span className="pr-2 font-semibold">
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
        {session && (
          <form className="flex items-center p-4">
            <EmojiHappyIcon className="h-7" />
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 border-none outline-none focus:ring-0"
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
    </>
  ) : (
    <div className="bg-white max-w-[100%] ">
      <div className="flex flex-col lg:flex-row max-w-[100%]">
        <div className="w-full bg-black max-h-[900px] max-w-[850px]">
          <Image
            src={img}
            className="object-contain"
            width={100}
            height={80}
            layout="responsive"
            alt=""
          />
        </div>
        <div className="">
          <div className="bg-white rounded-sm w-[100%] md:w-[100%] h-fit my-auto">
            <div className="flex items-center p-2 border-b-2 border-b-gray-200">
              <img
                className="object-contain p-1 mr-3 border rounded-full h-9 w-9"
                src={userImg}
                alt=""
              />
              <p className="flex-1 text-xs font-semibold">{username}</p>
              <DotsHorizontalIcon
                className="h-5 cursor-pointer"
                onClick={() =>
                  username === session.user.username && setOpenModal(true)
                }
              />
            </div>
          </div>

          <div className="">
            <div className="p-2 min-h-[100px] max-h-[200px] lg:min-h-[400px] xl:min-h-[600px] overflow-y-scroll">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex flex-col w-[100%] space-x-2 mb-3 "
                >
                  <div className="flex w-[100%]">
                    <img
                      className="w-5 h-5 mr-3 rounded-full"
                      src={comment.data().userImage}
                      alt=""
                    />
                    <p className="pr-5 text-xs break-all">
                      <span className="flex-1 pr-2 font-semibold">
                        {comment.data().username}
                      </span>
                      {comment.data().comment}
                    </p>
                  </div>
                  <div className="pl-8">
                    <Moment fromNow className="pr-5 text-xs text-gray-500">
                      {comment.data().timestamp?.toDate()}
                    </Moment>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 text-xs break-all border-t-2 border-t-gray-200">
              <span className="mr-1 text-xs font-semibold ">{username}</span>
              {caption}
              <div className="flex justify-between">
                <p className="mt-5 font-bold">
                  {likes ? likes.length : 0}{" "}
                  {likes.length === 1 ? "like" : "likes"}
                </p>
                <p className="mt-5 font-bold">
                  {comments.length}{" "}
                  {comments.length === 1 ? "comment" : "comments"}
                </p>
              </div>
            </div>

            <div className="h-auto">
              {session && (
                <div className="flex justify-between p-2">
                  <div className="flex space-x-4 ">
                    {hasLiked ? (
                      <HeartIconFilled
                        onClick={likePost}
                        className="text-red-500 btn"
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
                <div className="w-[100%] h-auto bottom-0">
                  <form className="flex items-center flex-end p-2 max-h-[50px] border-b-gray-200 border-t-2">
                    <EmojiHappyIcon className="h-7" />
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="flex-1 border-none outline-none focus:ring-0"
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
