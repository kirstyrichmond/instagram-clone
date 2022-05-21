import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState } from "../atoms/modalAtom";
import { postCountState } from "../atoms/postCountAtom";
import { selectedPostState } from "../atoms/selectedPostAtom";
import Header from "../components/Header";
import Posts from "../components/Posts";
import Modal from "../components/Modal";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";

const Profile = () => {
  const { data: user } = useSession();
  const postCount = useRecoilValue(postCountState);
  const selectedPost = useRecoilValue(selectedPostState);
  const [open, setOpen] = useRecoilState(modalState);
  const [userPage, setUserPage] = useState(user);
  const [currentUserPosts, setCurrentUserPosts] = useState();
  const router = useRouter();

  const {
    query: { id },
  } = router;
  
  useEffect(() => {
    const getUserDetails = async () => {
      const docRef = doc(db, "users", `${user?.user.id}`);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data(), "<< doc snap");
      return docSnap.data();
    };
    getUserDetails();
  }, [])

  // useEffect(
  //   () =>
  //     onSnapshot(
  //       query(collection(db, "posts"), orderBy("timestamp", "desc")),
  //       (snapshot) => {
  //         setUserPosts(snapshot.docs);
  //       }
  //     ),
  //   [db]
  // );
  
  // useEffect(
  //   () =>
  //     onSnapshot(
  //       query(collection(db, "users"), where("username", "==", id)),
  //       (snapshot) => {
  //         setUserPage(snapshot.docs);
  //         console.log(snapshot, "<< snapshot");
  //         console.log(snapshot.docs[0], "<< snapshot.docs");
  //       }
  //     ),
  //   [db]
  // );

  

  // export const getUserDetails = async (uid) => {
  //   const docRef = doc(db, "users", `${uid}`);
  //   const docSnap = await getDoc(docRef);
  //   return docSnap.data();
  // };
  

  useEffect(() => {
    if (user) {
      const getUserByUsername = async () => {
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", id));

        const querySnapshot = await getDocs(q);
        console.log(querySnapshot._snapshot.docChanges[0].doc.data.value.mapValue.fields, "<< query snapshot");
            //  setUserPage(querySnapshot._snapshot.docChanges[0].doc.data.value.mapValue.fields);
        //     // querySnapshot.forEach((doc) => {
        // setUserPage(querySnapshot[0].data());
        // });
        console.log(querySnapshot);
      };
      getUserByUsername();
    }
  }, []);

  console.log(userPage, "<< current users page");

  return (
    <div>
      <Header />
      <main className="grid grid-cols-1 mx-auto my-8 md:max-w-3xl xl:max-w-4xl">
        <Modal />
        <section className="grid grid-cols-3 h-80">
          <div className="relative w-24 h-24 col-span-1 mx-auto lg:w-48 lg:h-48 md:w-40 md:h-40 sm:w-28 sm:h-28">
            {user && (
              <>
                <Image
                  src={
                    userPage?.image
                      ? userPage.image
                      : "https://villagesonmacarthur.com/wp-content/uploads/2020/12/Blank-Avatar.png"
                  }
                  alt="profile pic"
                  className="rounded-full cursor-pointer w-[100%]"
                  layout="fill"
                />
              </>
            )}
          </div>
          <div className="col-span-2">
            <h2 className="mb-5 text-2xl font-light">{userPage?.username}</h2>
            <div>
              <p className="text-md">{postCount} posts</p>
            </div>
          </div>
        </section>
        <section className="">
          <p className="pb-5 text-center text-md">POSTS</p>
          <div className="" onClick={() => setOpen(!open)}>
            <Posts className="" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
