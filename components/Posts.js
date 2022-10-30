import React, { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Post from "./Post.js";
import Image from "next/image";
import { useSession } from "next-auth/react";
import postCountState from "../atoms/postCountAtom";
import { useSetRecoilState } from "recoil";
import selectedPostState from "../atoms/selectedPostAtom";

const Posts = ({ profilePage }) => {
  const [userPosts, setUserPosts] = useState([]);
  const setProfilePosts = useSetRecoilState(postCountState);
  const setSelectedPost = useSetRecoilState(selectedPostState);
  const { data: session } = useSession();

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setUserPosts(snapshot.docs);
        }
      ),
    [db]
  );

  const profilePosts = userPosts
    .map((post) => {
      if (session?.user.username === post.data().username) {
        return (
          <div
            key={post.id}
            className="mx-1 my-2 w-[30%] hover:bg-gray-500"
            onClick={() => setSelectedPost(post)}
          >
            <Image
              src={post.data().image}
              alt=""
              width={100}
              height={100}
              layout="responsive"
              objectFit="cover"
              className="hover:opacity-60"
            />
          </div>
        );
      }
    })
    .filter((e) => e !== undefined);

  setProfilePosts(profilePosts.length);

  const feedPosts = userPosts.map((post) => (
    <div key={post.id} className="p-0 md:p-5">
      <Post
        id={post.id}
        username={post.data().username}
        name={post.data().name}
        userImg={post.data().profileImg}
        img={post.data().image}
        caption={post.data().caption}
        className="p-5"
        onClick={() => post.data().image}
      />
    </div>
  ));

  return profilePage ? (
    <div className="flex flex-wrap justify-between px-2">{profilePosts}</div>
  ) : (
    <div>{feedPosts}</div>
  );
};

export default Posts;
