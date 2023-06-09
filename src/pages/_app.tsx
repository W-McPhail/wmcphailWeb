import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "npm/utils/api";

import "npm/styles/globals.css";

import { Toaster } from "react-hot-toast";

import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return(
    <ClerkProvider {...pageProps}>
      <Head>
        <title>W-McPhail</title>
        <meta name="description" content="🔥" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="bottom-center"/>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
