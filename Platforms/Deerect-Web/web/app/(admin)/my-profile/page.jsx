'use client'
import dynamic from "next/dynamic";
import MyProfile from "@/components/dashboard/my-profile";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from 'react';
import { redirect } from "next/navigation";

const metadata = {
  title: 'My Profile || FindHouse - Real Estate React Template',
  description: 'FindHouse - Real Estate React Template',
}

const Index = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.log(error);
          setLoading(false);
          redirect("/login");
        } else if (user) {
          setUser(user);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
        redirect("/login");
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!user && !loading) {
    redirect("/login");
  }

  return <MyProfile />;
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });