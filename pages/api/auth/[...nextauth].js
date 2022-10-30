import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import EmailProvider from "next-auth/providers/email";

const firebaseConfig = {
  apiKey: "AIzaSyBRSYqBVUTpXMuYfzu0fezhAi08fnGcEg0",
  authDomain: "instagram-b62ec.firebaseapp.com",
  projectId: "instagram-b62ec",
  storageBucket: "instagram-b62ec.appspot.com",
  messagingSenderId: "834479094225",
  appId: "1:834479094225:web:6558c66d2d9140bc1f88f0",
};

const authOptions = {
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
  ],
  adapter: FirestoreAdapter(firebaseConfig),
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token, user }) {
      console.log({ user, session, token });

      if (session.user.name) {
        session.user.username = session.user.name
          .split(" ")
          .join("")
          .toLocaleLowerCase();
      } else {
        session.user.username = session.user.email.split("@")[0];
      }
      session.user.image
        ? (session.user.image = session.user.image)
        : (session.user.image =
            "https://villagesonmacarthur.com/wp-content/uploads/2020/12/Blank-Avatar.png");

      session.user.id = user.id;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
