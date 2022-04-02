import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import Post from "./Post";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { postCountState } from "../atoms/postCountAtom";
import { useRecoilState, useSetRecoilState } from "recoil";

const Posts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const setProfilePosts = useSetRecoilState(postCountState);
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

   const profilePosts = userPosts.map((post) => {
    if (session?.user?.username === post.data().username) {
      return (
        <div key={post.id} className="flex">
          <Image
            src={post.data().image}
            alt=""
            width="250%"
            height="250%"
            className=""
          />
        </div>
      )
    }
  }).filter((e) => e !== undefined)

  setProfilePosts(profilePosts.length)

  const feedPosts = userPosts.map((post) => (
    <div key={post.id} className="p-5">
      <Post
        id={post.id}
        username={post.data().username}
        userImg={post.data().profileImg}
        img={post.data().image}
        caption={post.data().caption}
        className="p-5"
      />
    </div>
  ));


  console.log(profilePosts.length, "<< post count from length");
  console.log(feedPosts.length, "<< feed count");

  return id === "profile" ? (
    <div className="flex space-x-5 flex-wrap">{profilePosts}</div>
  ) : (
    <div>{feedPosts}</div>
  );
};

export default Posts;
