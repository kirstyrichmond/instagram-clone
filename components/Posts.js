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
  const { data: user } = useSession();
  const {
    query: { id },
  } = router;

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

  // useEffect(() => {
    if (user) {
      // const getPostsByUsername = async () => {
      //   const userRef = collection(db, "posts");
      //   const q = query(userRef, where("username", "==", id));

      //   const querySnapshot = await getDocs(q);
      //   querySnapshot.forEach((doc) => {
      //     setUserPage(doc.data());
      //   });
      // };
      // getUserByUsername();
    }
  // }, []);

  const profilePosts = userPosts
    .map((post) => {
      if (user?.user.username === post.data().username) {
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

  return id === user?.user.username ? (
    <div className="flex flex-wrap justify-between px-2">{profilePosts}</div>
  ) : (
    <div>{feedPosts}</div>
  );
};

export default Posts;
