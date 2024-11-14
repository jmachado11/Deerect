'use client'
import dynamic from "next/dynamic";
import MyDashboard from "@/components/dashboard/my-dashboard";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from 'react';
import { redirect } from "next/navigation";
const metadata = {
  title: 'Dashboard || FindHouse - Real Estate React Template',
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
      <MyDashboard />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
