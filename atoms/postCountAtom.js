import { atom } from "recoil";

const postCountState = atom({
  key: "postCountState",
  default: 0,
});

export default postCountState;