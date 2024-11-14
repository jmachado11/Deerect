'use client'
import dynamic from "next/dynamic";
import CreateListing from "@/components/dashboard/create-listing";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from 'react';
import { redirect } from "next/navigation";
const metadata = {
  title: 'Create Listing || FindHouse - Real Estate React Template',
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
        if (!user) {
          redirect("/login");
        }
        setUser(user);

      }
    }

    fetchUser();
  }, []);
  
  return (
    <>
      <CreateListing />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
