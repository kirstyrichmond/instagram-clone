import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { useRecoilValue } from "recoil";
import { postCountState } from "../atoms/postCountAtom";
import Header from "../components/Header";
import Posts from "../components/Posts";

const Profile = () => {
  const { data: session } = useSession();
  const postCount = useRecoilValue(postCountState);

  return (
    <div>
      <Header />
      <main className="grid grid-cols-1 md:max-w-3xl xl:max-w-4xl mx-auto my-8">
        <section className="grid grid-cols-3 h-80">
          <div className="col-span-1">
            <Image
              src={session?.user.image}
              alt="profile pic"
              className="rounded-full cursor-pointer flex justify-center"
              width="150"
              height="150"
            />
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
          <div className="">
            <Posts className="" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
