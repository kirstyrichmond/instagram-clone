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
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const router = useRouter();

  return (
    <div className="shadow-sm border-b bg-white sticky top-0 z-40">
      <div className="flex justify-between max-w-4xl mx-5 md:mx-auto">
        <div
          onClick={() => router.push("/")}
          className="relative inline-grid w-24 cursor-pointer"
        >
          <Image
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
            layout="fill"
            objectFit="contain"
            alt=""
          />
        </div>

        <div className="max-w-xs">
          <div className="relative mt-1 p-3 rounded-md">
            <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              className="bg-gray-100 block w-full pl-10 focus:ring-transparent focus:border-transparent border-transparent rounded-lg"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-5">
          <HomeIcon onClick={() => router.push("/")} className="navBtn" />
          <MenuIcon className="w-8 h-8 md:hidden cursor-pointer" />
          {session ? (
            <>
              <div className="relative">
                <PaperAirplaneIcon className="navBtn rotate-45" />
                <div className="absolute -top-1 -right-2 text-xs w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white">
                  3
                </div>
              </div>
              <PlusCircleIcon
                onClick={() => setOpen(true)}
                className="navBtn"
              />
              <GlobeIcon className="navBtn" />
              <HeartIcon className="navBtn" />
              <Link
                href={{
                  pathname: "/profile",
                  query: { id: `${session?.user.username}` },
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
            <button onClick={signIn}>Sign in</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
