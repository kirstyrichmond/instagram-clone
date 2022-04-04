import { atom } from "recoil";

export const selectedPostState = atom({
  key: "selectedPostState",
  default: null,
  dangerouslyAllowMutability: true,
});
