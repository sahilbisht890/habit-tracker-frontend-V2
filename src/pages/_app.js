import "@/styles/globals.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import Head from "next/head";
import store from "@/components/store";
import { checkAuth } from "@/components/store/slices/userSlice";

const AppContent = ({ Component, pageProps }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const storedMode =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;

    if (!userData || typeof userData.mode === "undefined") {
      if (!storedMode) return;
      const isDark = storedMode === "dark";
      root.classList.toggle("dark", isDark);
      body.classList.toggle("dark", isDark);
      root.setAttribute("data-theme", isDark ? "dark" : "light");
      return;
    }

    const mode = userData?.mode || "light";
    const isDark = mode === "dark";
    root.classList.toggle("dark", isDark);
    body.classList.toggle("dark", isDark);
    root.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [userData]);

  return (
    <>
      <Head>
        <title>Tracko</title>
        <meta name="application-name" content="Tracko" />
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/logo.svg" />
      </Head>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{ duration: 3000 }}
        newestOnTop
      />
    </>
  );
};

export default function App({ Component, pageProps }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return (
    <Provider store={store}>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <AppContent Component={Component} pageProps={pageProps} />
        </GoogleOAuthProvider>
      ) : (
        <AppContent Component={Component} pageProps={pageProps} />
      )}
    </Provider>
  );
}
