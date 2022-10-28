import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import postCountState from "../atoms/postCountAtom";
import Header from "../components/Header";
import Posts from "../components/Posts";
import Modal from "../components/Modal";
import { MdSettings } from "react-icons/md";
import ModalWrapper from "../components/Modal";
import PostModal from "../components/PostModal";

const Profile = () => {
  const { data: session } = useSession();
  const postCount = useRecoilValue(postCountState);
  const [openModal, setOpenModal] = useState(false);
  const [openPostModal, setOpenPostModal] = useState(false);

  return (
    <div>
      <ModalWrapper
        title={"Delete Account"}
        action={""}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <PostModal
        openPostModal={openPostModal}
        setOpenPostModal={setOpenPostModal}
      />

      <Header />
      <main className="grid grid-cols-1 mx-auto my-8 md:max-w-3xl xl:max-w-4xl">
        <Modal />
        <section className="grid grid-cols-3 h-80">
          <div className="relative w-24 h-24 col-span-1 mx-auto lg:w-48 lg:h-48 md:w-40 md:h-40 sm:w-28 sm:h-28">
            <Image
              src={session?.user.image}
              alt="profile pic"
              className="rounded-full cursor-pointer w-[100%]"
              layout="fill"
            />
          </div>
          <div className="col-span-2">
            <div className="flex items-center content-center h-10 mb-6 align-middle">
              <h2 className="mr-6 text-3xl font-light ">
                {session?.user.username}
              </h2>
              <MdSettings
                onClick={() => setOpenModal(true)}
                className="text-[22px] cursor-pointer"
              />
            </div>
            <div className="flex justify-between mb-8">
              <p className="text-lg">{postCount} posts</p>
              <p className="text-lg">0 followers</p>
              <p className="text-lg">0 following</p>
            </div>
            <h2 className="mb-5 text-xl font-medium">{session?.user.name}</h2>
          </div>
        </section>
        <section className="">
          {/* {!postCount ? (
            <p className="text-center">You have no posts.</p>
          ) : (
            <> */}
          <p className="pb-5 text-center text-md">POSTS</p>
          <div
            className="cursor-pointer"
            onClick={() => setOpenPostModal(true)}
          >
            <Posts profilePage={true} className="" />
          </div>
          {/* </>
          )} */}
        </section>
      </main>
    </div>
  );
};

export default Profile;
