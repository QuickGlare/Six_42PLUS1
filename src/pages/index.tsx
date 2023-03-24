import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import ChatBot from "./chatbot";
import { LineChart } from "recharts";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chatbot</title>
        <meta name="description" content="Sample Chatbot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-10 grid grid-cols-3">
        <div></div>
        <div className="flex justify-center">
        <ChatBot/>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Home;

