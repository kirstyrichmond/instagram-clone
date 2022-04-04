import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import Post from "./Post";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { postCountState } from "../atoms/postCountAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import { selectedPostState } from "../atoms/selectedPostAtom";

const Posts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const setProfilePosts = useSetRecoilState(postCountState);
  const setSelectedPost = useSetRecoilState(selectedPostState);
  const router = useRouter();
  const { data: session } = useSession();
  const {
    query: { id },
  } = router;

  console.log(id, "<< path");

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
      if (session?.user?.username === post.data().username) {
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
    <div key={post.id} className="p-5">
      <Post
        id={post.id}
        username={post.data().username}
        userImg={post.data().profileImg}
        img={post.data().image}
        caption={post.data().caption}
        className="p-5"
        onClick={() => post.data().image}
      />
    </div>
  ));

  return id === session?.user.username ? (
    <div className="flex justify-between flex-wrap px-2">{profilePosts}</div>
  ) : (
    <div>{feedPosts}</div>
  );
};

export default Posts;
