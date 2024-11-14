'use client'
import Link from "next/link";
import MobileMenuContent from "./MobileMenuContent";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Import createClient

const MobileMenu = () => {
  
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
    // <!-- Main Header Nav For Mobile -->
    <div className="stylehome1 h0 mega-menu-wrapper">
      <div className="mobile-menu">
        <div className="header stylehome1">
          <div className="main_logo_home2 text-center">
            <Image
              width={150}
              height={125}
              className="nav_logo_img contain mt-20 "
              src="/assets/images/Deerect (white red).png"
              alt="header-logo2.png"
            />
            
          </div>
          {/* main_logo_home2 */}

          <ul className="menu_bar_home2">
            <li className="list-inline-item list_s">
              {user ? 
                <Link href="/my-profile" className="">
                  <span className="flaticon-user"></span>
                </Link> :
                <Link href="/login">
                  <span >Login</span> 
                </Link>

              }
            </li>
            <li
              className="list-inline-item"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasMenu"
              aria-controls="offcanvasMenu"
            >
              <a>
                <span></span>
              </a>
            </li>
          </ul>
          {/* menu_bar_home2 */}
        </div>
      </div>
      {/* <!-- /.mobile-menu --> */}

      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasMenu"
        aria-labelledby="offcanvasMenuLabel"
        data-bs-scroll="true"
      >
        <MobileMenuContent />
      </div>
    </div>
  );
};

export default MobileMenu;
