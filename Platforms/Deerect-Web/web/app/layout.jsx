"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import ScrollToTop from "@/components/common/ScrollTop";
import "../public/assets/scss/index.scss";
import Script from "next/script";
import Header from "@/components/waitlist/Header";
import Footer from "@/components/footer/Footer";
if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Nunito:400,400i,500,600,700&display=swap"
        />
        <link rel="icon" href="./favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inria+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#121212"/>
      </head>
      <body>
        <Provider store={store}>
          <Header />
          {children}
          <Footer />
        </Provider>

        <ScrollToTop />
        <Script
          src="https://kit.fontawesome.com/3bfaa29157.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        ></Script>
      </body>
    </html>
  );
}
