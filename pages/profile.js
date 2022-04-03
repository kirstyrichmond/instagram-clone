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
      <main className="grid grid-cols-1 md:max-w-3xl xl:max-w-4xl mx-auto my-8">
            <Modal />
        <section className="grid grid-cols-3 h-80">
          <div className="col-span-1 lg:w-48 lg:h-48 md:w-40 md:h-40 sm:w-28 sm:h-28 w-24 h-24 relative mx-auto">
            {session && (
              <>
                <Image
                  src={session?.user.image}
                  alt="profile pic"
                  className="rounded-full cursor-pointer w-[100%]"
                  layout="fill"
                />
              </>
            )}
          </div>
          <div className="col-span-2">
            <h2 className="text-2xl font-light mb-5">
              {session?.user.username}
            </h2>
            <div>
              <p className="text-md">{postCount} posts</p>
            </div>
          </div>
        </section>
        <section className="">
          <p className="text-md text-center pb-5">POSTS</p>
          <div className="" onClick={() => setOpen(!open)}>
            <Posts className="" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
