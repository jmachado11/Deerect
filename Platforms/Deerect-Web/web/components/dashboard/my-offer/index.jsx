'use client'
import DefaultHeader from "../../common/header/DefaultHeader";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu";
import MobileMenu from "../../common/header/MobileMenu";
import AllStatistics from "./AllStatistics";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from 'react';
import { redirect,} from "next/navigation";

const index = () => {

  const [userName, setUserName] = useState(null);
  

  useEffect(() => {
    const supabase = createClient();

    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.log(error);
        redirect("/login")
      } else if (user) {
        setUserName(user.user_metadata.full_name);
        
      }
    }

    fetchUser();
  }, []);

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <DefaultHeader />

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      <div className="dashboard_sidebar_menu">
        <div
          className="offcanvas offcanvas-dashboard offcanvas-start"
          tabIndex="-1"
          id="DashboardOffcanvasMenu"
          data-bs-scroll="true"
        >
          <SidebarMenu />
        </div>
      </div>
      {/* End sidebar_menu */}

      {/* <!-- Our Dashbord --> */}
      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div className="container-fluid ovh">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">
                
              </div>
              {/* End .row */}

              <div className="row">
                <AllStatistics />
              </div>
              {/* End .row Dashboard top statistics */}


              
              {/* End .row */}
            </div>
            {/* End .col */}
          </div>
        </div>
      </section>
    </>
  );
};

export default index;
