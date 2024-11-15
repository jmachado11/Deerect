'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderMenuContent from "../common/header/HeaderMenuContent";
import DefaultHeader from "../common/header/DefaultHeader";
import Image from "next/image";

const Header = () => {
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 95) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  return (
    <DefaultHeader/>
  );
};

export default Header;
