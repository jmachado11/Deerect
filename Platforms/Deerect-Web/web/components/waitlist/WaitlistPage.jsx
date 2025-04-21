import { useState, useEffect } from "react";
import DescriptionPage from "./DescriptionPage";
import Header from "./Header";
import Hero from "./Hero";
import Footer from "../footer/Footer";
import "../../public/assets/scss/waitlist.css";

function WaitlistPage() {
  return (
    <>
      <Hero />
      <DescriptionPage />
    </>
  );
}

export default WaitlistPage;
