'use client'

// import "react-pro-sidebar/dist/css/styles.css";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Import createClient
import {
  ProSidebar,
  Menu,
  MenuItem,
} from "react-pro-sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const MobileMenuContent = () => {
  const pathname = usePathname();
  const router = useRouter();
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
    <>
      <div className="sidebar-header mb-20">
        <Link href="/" className="sidebar-header-inner">
        <Image
              width={200}
              height={95}
              className="nav_logo_img contain  "
              src="/assets/images/Deerect (white red).png"
              alt="header-logo2.png"
            />
        </Link>
        <div
          className="fix-icon"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <span className="flaticon-close"></span>
        </div>
      </div>

      <div style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', marginBottom: '20' }}>
        <Menu>
          <MenuItem>
            <div
              onClick={() => router.push("/")}
              className={
                pathname === "/" ? "ui-active" : 'inactive-mobile-menu'
              }
            >
              Home
            </div>
          </MenuItem>
          <MenuItem>
            <div
              onClick={() => router.push("/my-dashboard")}
              className={
                pathname === "/my-dashboard" ? "ui-active" : 'inactive-mobile-menu'
              }
            >
              Dashboard
            </div>
          </MenuItem>
          <MenuItem>
            <div
              onClick={() => router.push("/contact")}
              className={
                pathname === "/contact" ? "ui-active" : 'inactive-mobile-menu'
              }
            >
              Contact
            </div>
          </MenuItem>

          
        </Menu>
      </div>

      <Link
        href="/create-listing"
        className="btn btn-block btn-lg btn-thm circle "
        style={{ width: '90%', margin: '0px auto' }}
      >
        <span className="flaticon-plus"></span> Create Listing
      </Link>
    </>
  );
};

export default MobileMenuContent;
