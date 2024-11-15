'use client'
import dynamic from "next/dynamic";
import SignUp from "@/components/register";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from 'react';
import { redirect } from "next/navigation";
const metadata = {
  title: 'SignUp || FindHouse - Real Estate React Template',
  description:
    'FindHouse - Real Estate React Template',
}

const index = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.log(error);
      } else if (user) {
        setUser(user);
      }
    }

    fetchUser();
  }, []);
  if (user) {
    redirect("/");
  }
  return (
    <>
      <SignUp />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
