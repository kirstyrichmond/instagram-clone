import React from "react";
import Post from "./Post";

const posts = [
  {
    id: "123",
    username: "kirsty123",
    userImg:
      "https://scontent.fman4-1.fna.fbcdn.net/v/t1.6435-9/66919391_10217712519592204_6550836556838469632_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=174925&_nc_ohc=LM5vIgGRAK0AX__H8fl&_nc_ht=scontent.fman4-1.fna&oh=00_AT9ukdPd7CaraXCfMcO9ss1S91uDTpV0uKdORfgY-yKEQw&oe=6260D2E0",
    img: "https://scontent.fman4-1.fna.fbcdn.net/v/t1.6435-9/66919391_10217712519592204_6550836556838469632_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=174925&_nc_ohc=LM5vIgGRAK0AX__H8fl&_nc_ht=scontent.fman4-1.fna&oh=00_AT9ukdPd7CaraXCfMcO9ss1S91uDTpV0uKdORfgY-yKEQw&oe=6260D2E0",
    caption: "THIS IS AMAZING!!",
  },
  {
    id: "123",
    username: "kirsty123",
    userImg:
      "https://scontent.fman4-1.fna.fbcdn.net/v/t1.6435-9/66919391_10217712519592204_6550836556838469632_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=174925&_nc_ohc=LM5vIgGRAK0AX__H8fl&_nc_ht=scontent.fman4-1.fna&oh=00_AT9ukdPd7CaraXCfMcO9ss1S91uDTpV0uKdORfgY-yKEQw&oe=6260D2E0",
    img: "https://scontent.fman4-1.fna.fbcdn.net/v/t1.6435-9/66919391_10217712519592204_6550836556838469632_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=174925&_nc_ohc=LM5vIgGRAK0AX__H8fl&_nc_ht=scontent.fman4-1.fna&oh=00_AT9ukdPd7CaraXCfMcO9ss1S91uDTpV0uKdORfgY-yKEQw&oe=6260D2E0",
    caption: "THIS IS AMAZING!!",
  },
];

const Posts = () => {
  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          username={post.username}
          userImg={post.userImg}
          img={post.img}
          caption={post.caption}
        />
      ))}
    </div>
  );
};

export default Posts;
