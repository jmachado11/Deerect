'use client'
import dynamic from "next/dynamic";
import HomeMain from "@/components/home";
import GridV1 from "@/components/listing-grid/grid-v1";

const metadata = {
  title: 'Home-1 || FindHouse - Real Estate React Template',
  description:
    'FindHouse - Real Estate React Template',
}

const index = () => {
  return (
    <>
      {/* <HomeMain /> */}
      <GridV1 />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
