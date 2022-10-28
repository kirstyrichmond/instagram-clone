import { atom } from "recoil";

const selectedPostState = atom({
  key: "selectedPostState",
  default: null,
  dangerouslyAllowMutability: true,
});

export default selectedPostState;