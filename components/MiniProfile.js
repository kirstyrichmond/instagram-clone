import React from "react";
import { signOut, useSession } from "next-auth/react";

const MiniProfile = () => {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between max-w-xs ml-10 mt-14">
      <img
        className="w-16 h-16 rounded-full border p-[2px]"
        src={session?.user.image}
        alt=""
      />
      <div className="flex-1 mx-4">
        <h2 className="text-sm font-bold">{session?.user.username}</h2>
        <h3 className="text-sm text-gray-400">{session?.user.name}</h3>
      </div>
      <button onClick={signOut} className="text-sm font-semibold text-blue-400">
        Sign out
      </button>
    </div>
  );
};

export default MiniProfile;
