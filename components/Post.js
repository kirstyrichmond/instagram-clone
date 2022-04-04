import React, { useState, useEffect } from "react";
import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  PaperAirplaneIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
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
import { db } from "../firebase";
import Moment from "react-moment";
import { useRouter } from "next/router";
import Image from "next/image";
import { useRecoilValue } from "recoil";

const Post = ({ id, username, userImg, img, caption }) => {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
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
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
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

  return router.pathname === "/" ? (
    <div className={`bg-white my-7 border rounded-sm`}>
      {/* Header */}
      <div className="flex items-center p-5">
        <img
          className="rounded-full h-12 w-12 border p-1 mr-3 object-contain"
          src={userImg}
          alt=""
        />
        <p className="flex-1 font-bold">{username}</p>
        <DotsHorizontalIcon className="h-5" />
      </div>

      {/* Image */}
      <img src={img} className="object-cover w-full" alt="" />

      {/* Buttons */}
      {session && (
        <div className="flex justify-between px-4 pt-4">
          <div className="flex space-x-4">
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

      {/* Caption */}
      <div className="p-5 truncate">
        {likes.length > 0 && (
          <p className="font-bold mb-1">{likes.length} likes</p>
        )}
        <span className="font-bold mr-1">{username} </span>
        {caption}
      </div>

      {/* Comments */}

      {comments.length > 0 && (
        <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin break-all">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-center space-x-2 mb-3">
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

      {/* Input box */}
      {session && (
        <form className="flex items-center p-4">
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
  ) : (
    <div className="bg-white">
      <div className="flex ">
        <div className="w-11/12 bg-black max-h-[900px] max-w-[900px]">
          <Image
            src={img}
            className="object-contain"
            width={100}
            height={100}
            layout="responsive"
            alt=""
          />
        </div>
        <div className="bg-white rounded-sm mt-5 w-[34%]">
          <div className="flex items-center p-5 h-[10%] border-b-gray-200 border-b-2">
            <img
              className="rounded-full h-12 w-12 border p-1 mr-3 object-contain"
              src={userImg}
              alt=""
            />
            <p className="flex-1 font-bold">{username}</p>
            <DotsHorizontalIcon className="h-5" />
          </div>

          <div className="h-[550px] pt-5">
            {comments.length > 0 && (
              <div className="pl-5 h-[100%] overflow-y-auto">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex flex-col w-[100%] space-x-2 mb-3 "
                  >
                    <div className="flex w-[100%]">
                      <img
                        className="h-7 w-7 rounded-full mr-3"
                        src={comment.data().userImage}
                        alt=""
                      />
                      <p className="text-xs break-all pr-5">
                        <span className="font-semibold pr-2">
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
            )}
          </div>
          <div className="h-[100px] border-b-gray-200 border-t-2">
            {session && (
              <div className="flex justify-between px-4 pt-4 py-4">
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

            <div className="p-5 pt-0 truncate text-xs break-all">
              {likes.length > 0 && (
                <p className="font-bold mb-1">{likes.length} likes</p>
              )}
              <span className="font-semibold mr-1 text-xs ">{username}</span>
              {caption}
            </div>

            {session && (
              <div className="w-[100%]">
                <form className="flex items-center flex-end p-4 h-[100px] border-b-gray-200 border-t-2">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
