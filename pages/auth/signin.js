import React from "react";
import { getProviders, signIn } from "next-auth/react";
import Header from "../../components/Header.js";
import { FcGoogle } from "react-icons/fc";

const signin = ({ providers }) => {
  return (
    <>
      <Header />
      <div className="">
        <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-56 text-center px-14">
          <img
            className="object-contain w-auto"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
            alt=""
          />
          <p className="italic font-xs">
            This is not a REAL app, it has been built for learning purposes
            only.
          </p>
          {/* <p className="mb-12 font-bold text-8xl">Happening now</p>
          <p className="text-4xl font-semibold">Join Instagram today.</p> */}
          {/* <div>
           <form onSubmit={() => signIn("email", { callbackUrl: "/" })}>
             <p>Email</p>
             <input name="email" type="email" placeholder="Email"/>
             <button type="submit">Submit</button>
           </form>
            
          </div> */}
          <div className="mt-40">
            {/* {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button
                  className="p-3 text-white bg-blue-500 rounded-lg"
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                >
                  Sign in with {provider.name}
                </button>
              </div>
            ))} */}
            <div
              className="flex gap-4 bg-white p-2 px-14 items-center rounded-[50px] cursor-pointer text-lg border-2 border-gray"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <FcGoogle className="text-[36px]" />
              Sign in with Google
            </div>
            {/* <div
              className="flex gap-4 bg-white p-2 px-14 items-center rounded-[50px] cursor-pointer text-lg border-2 border-gray"
              onClick={() => signIn("github", { callbackUrl: "/" })}
            >
              <FcGoogle className="text-[36px]" />
              Sign in with Github
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}

export default signin;
