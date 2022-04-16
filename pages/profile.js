import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState } from "../atoms/modalAtom";
import { postCountState } from "../atoms/postCountAtom";
import { selectedPostState } from "../atoms/selectedPostAtom";
import Header from "../components/Header";
import Posts from "../components/Posts";
import Modal from "../components/Modal";

const Profile = () => {
  const { data: session } = useSession();
  const postCount = useRecoilValue(postCountState);
  const selectedPost = useRecoilValue(selectedPostState);
  const [open, setOpen] = useRecoilState(modalState);

  console.log(selectedPost, "<< selected post IN PROFILE");

  console.log(open, "<< profile modal open ?");

  return (
    <div>
      <Header />
      <main className="grid grid-cols-1 mx-auto my-8 md:max-w-3xl xl:max-w-4xl">
        <Modal />
        <section className="grid grid-cols-3 h-80">
          <div className="relative w-24 h-24 col-span-1 mx-auto lg:w-48 lg:h-48 md:w-40 md:h-40 sm:w-28 sm:h-28">
            {session && (
              <>
                <Image
                  src={session.image}
                  alt="profile pic"
                  className="rounded-full cursor-pointer w-[100%]"
                  layout="fill"
                />
              </>
            )}
          </div>
          <div className="col-span-2">
            <h2 className="mb-5 text-2xl font-light">{session?.username}</h2>
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
