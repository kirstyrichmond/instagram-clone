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

const Header = () => {
  return (
    <div className="shadow-sm border-b bg-white sticky top-0 z-50">
      <div className="flex justify-between max-w-6xl mx-5 md:mx-auto">
        {/* left */}
        <div className="relative inline-grid w-24 cursor-pointer">
          <Image
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
            layout="fill"
            objectFit="contain"
            alt=""
          />
        </div>

        {/* middle */}
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

        {/* right */}
        <div className="flex items-center justify-end space-x-4">
          <HomeIcon className="navBtn" />
          <MenuIcon className="w-8 h-8 md:hidden cursor-pointer" />
          <div className="relative">
            <PaperAirplaneIcon className="navBtn rotate-45" />
            <div className="absolute -top-1 -right-2 text-xs w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white">
              3
            </div>
          </div>
          <PlusCircleIcon className="navBtn" />
          <GlobeIcon className="navBtn" />
          <HeartIcon className="navBtn" />
          <Image
            src="https://scontent.fman4-1.fna.fbcdn.net/v/t1.6435-9/66919391_10217712519592204_6550836556838469632_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=174925&_nc_ohc=LM5vIgGRAK0AX__H8fl&_nc_ht=scontent.fman4-1.fna&oh=00_AT9ukdPd7CaraXCfMcO9ss1S91uDTpV0uKdORfgY-yKEQw&oe=6260D2E0"
            alt="profile pic"
            height={40}
            width={40}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
