import React from "react";

const MiniProfile = () => {
  return (
    <div className="flex items-center justify-between mt-14 ml-10">
      <img
        className="w-16 h-16 rounded-full border p-[2px]"
        src="https://scontent.fman4-1.fna.fbcdn.net/v/t1.6435-9/66919391_10217712519592204_6550836556838469632_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=174925&_nc_ohc=LM5vIgGRAK0AX__H8fl&_nc_ht=scontent.fman4-1.fna&oh=00_AT9ukdPd7CaraXCfMcO9ss1S91uDTpV0uKdORfgY-yKEQw&oe=6260D2E0"
        alt=""
      />
      <div className="flex-1 mx-4">
        <h2 className="font-bold">kirstyr123</h2>
        <h3 className="text-sm text-gray-400">Welcome to Instagram</h3>
      </div>
      <button className="text-blue-400 text-sm font-semibold">Sign out</button>
    </div>
  );
};

export default MiniProfile;
