
'use client'

import dynamic from "next/dynamic";
import NotFound from "@/components/404";



const index = () => {
  return (
    <>
      <NotFound />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
