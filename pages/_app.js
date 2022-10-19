// pages/_app.js
import { SessionProvider as AuthProvider } from "next-auth/react";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { MantineProvider } from "@mantine/core";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <AuthProvider session={session}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Component {...pageProps} />
        </MantineProvider>
      </AuthProvider>

      <Toaster />
    </>
  );
}

export default MyApp;
