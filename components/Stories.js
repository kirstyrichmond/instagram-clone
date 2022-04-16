import React, { useEffect, useState } from "react";
import faker from "@faker-js/faker";
import Story from "./Story";
import { useSession } from "next-auth/react";

const Stories = () => {
  const [suggestions, setSuggestions] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const suggestions = [...Array(20)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
    }));
    setSuggestions(suggestions);
  }, []);

  return (
    <div className="flex p-6 space-x-2 overflow-x-scroll">
      {session && <Story img={session.image} username={session.username} />}
      {suggestions.map((profile) => (
        <Story
          key={profile.id}
          img={profile.avatar}
          username={profile.username}
        />
      ))}
    </div>
  );
};

export default Stories;
