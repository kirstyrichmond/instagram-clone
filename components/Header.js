import Image from "next/image";
import React from "react";
import {
  SearchIcon,
  MenuIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  GlobeIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import { HomeIcon } from "@heroicons/react/solid";
import { HiOutlineCamera } from "react-icons/hi";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import modalState from "../atoms/modalAtom";
import Link from "next/link";
import AddPostModal from "./AddPostModal";

const Header = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const router = useRouter();

  return (
    <>
      <AddPostModal />
      <div className="sticky top-0 z-40 pt-3 pb-2 bg-white border-b shadow-sm">
        <div className="flex justify-between max-w-4xl ml-2 mr-4 md:mx-auto min-[1280px]:mx-auto">
          <div className="flex">
            {session && (
              <HiOutlineCamera
                onClick={() => setOpen(true)}
                className="mr-1 w-7 h-7 sm:hidden"
              />
            )}

            <div
              onClick={() => router.push("/")}
              className="relative inline-grid mt-1 cursor-pointer h-7 w-28"
            >
              <Image
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                layout="fill"
                objectFit="contain"
                alt=""
                className=""
              />
            </div>
          </div>
          {/* 
          <div className="hidden max-w-xs lg:flex">
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                className="block w-[130%] pl-10 bg-gray-100 border-transparent rounded-lg focus:ring-transparent focus:border-transparent"
                type="text"
                placeholder="Search"
              />
            </div>
          </div> */}

          <div className="flex items-center justify-end space-x-5 md:mr-4">
            {session ? (
              <>
                <HomeIcon onClick={() => router.push("/")} className="navBtn" />
                {/* <MenuIcon className="w-8 h-8 cursor-pointer md:hidden" /> */}
                {/* <div className="relative">
                  <PaperAirplaneIcon className="rotate-45 navBtn" />
                </div> */}
                <PlusCircleIcon
                  onClick={() => setOpen(true)}
                  className="navBtn"
                />
                <GlobeIcon className="navBtn" />
                <HeartIcon className="navBtn" />
                <Link
                  href={{
                    pathname: "/profile",
                    query: { id: `${session.user.username}` },
                  }}
                  passHref
                >
                  <a>
                    <Image
                      src={session.user.image}
                      alt="profile pic"
                      className="rounded-full cursor-pointer"
                      width="30"
                      height="30"
                    />
                  </a>
                </Link>
              </>
            ) : (
              <button className="font-medium" onClick={signIn}>
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
