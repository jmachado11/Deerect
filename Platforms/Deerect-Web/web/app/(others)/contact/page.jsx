'use client'
import dynamic from "next/dynamic";
import Contact from "@/components/NewContact/contact";

const metadata = {
  title: 'Contact || FindHouse - Real Estate React Template',
  description:
    'FindHouse - Real Estate React Template',
}

const index = () => {
  return (
    <>
      <Contact />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
