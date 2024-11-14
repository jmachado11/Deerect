'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from 'react';

const HeaderMenuContent = ({ float = "" }) => {
  //const supabase = createClient()
  

  const pathname = usePathname();
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

  return (
    <ul
      id="respMenu"
      className="ace-responsive-menu text-end d-lg-block d-none"
      data-menu-style="horizontal"
    >
      <li className="last">
        <Link
          href="/"
          className={pathname === "/" ? "ui-active" : undefined}
        >
          Home
        </Link>
      </li>

      

      <li className="last">
        <Link
          href="/my-dashboard"
          className={pathname === "/my-dashboard" ? "ui-active" : undefined}
        >
          Dashboard
        </Link>
      </li>
      {/* End .dropitem */}

      

      <li className="last">
        <Link
          href="/contact"
          className={pathname === "/contact" ? "ui-active" : undefined}
        >
          Contact
        </Link>
      </li>
      {/* End .dropitem */}

      {user ? (
        <li className={`list-inline-item list_s ${float}`}>
          <Link href="/my-profile" className="btn flaticon-user ">
            <span className="user-email" >{user.user_metadata.full_name}</span>
          </Link>
        </li>
      ) : (
        <li className={`list-inline-item list_s ${float}`}>
          <Link href="/login" className="btn flaticon-user user-email">
            <span className="dn-lg user-email">Login</span>
          </Link>
        </li>
      )}
      {/* End .dropitem */}

      <li className={`list-inline-item add_listing ${float}`}>
        <Link href="/create-listing">
          <span className="flaticon-plus"></span>
          <span className="dn-lg"> Create Listing</span>
        </Link>
      </li>
      {/* End .dropitem */}
    </ul>
  );
};

export default HeaderMenuContent;