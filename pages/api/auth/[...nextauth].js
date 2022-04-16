import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";
import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  where,
  limit,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRSYqBVUTpXMuYfzu0fezhAi08fnGcEg0",
  authDomain: "instagram-b62ec.firebaseapp.com",
  projectId: "instagram-b62ec",
  storageBucket: "instagram-b62ec.appspot.com",
  messagingSenderId: "834479094225",
  appId: "1:834479094225:web:6558c66d2d9140bc1f88f0",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();

export default NextAuth({
  // Configure one or more authentication providers
  adapter: FirebaseAdapter({
    db,
    collection,
    query,
    getDocs,
    where,
    limit,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    runTransaction,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),

    // ...add more providers here
  ],
  // pages: {
  //   signIn: "/auth/signin",
  // },
  callbacks: {
    async session({ session, token, user }) {
      if (session.user.name) {
        user.username = session.user.name
          .split(" ")
          .join("")
          .toLocaleLowerCase();
      } else {
        user.username = session.user.email.split("@")[0];
      }
      session.user.image
        ? (user.image = session.user.image)
        : (user.image =
            "https://villagesonmacarthur.com/wp-content/uploads/2020/12/Blank-Avatar.png");

      return {
        name: user.name,
        email: user.email,
        username: user.username,
        image: user.image,
      };
    },
  },
  secret: process.env.SECRET,
});
