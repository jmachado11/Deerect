'use client'
import DefaultHeader from "../../common/header/DefaultHeader";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu";
import MobileMenu from "../../common/header/MobileMenu";
import Activities from "./Activities";
import AllStatistics from "./AllStatistics";
import SoldTaxLiensStatisticsChart from "./SoldTaxLiensStatisticsChart";
import ListingViewsStatisticsChart from "./ListingViewsStatisticsChart";
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
                {/* Start Dashboard Navigation */}
                <div className="col-lg-12">
                  <div className="dashboard_navigationbar dn db-1024">
                    <div className="dropdown">
                      <button
                        className="dropbtn"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#DashboardOffcanvasMenu"
                        aria-controls="DashboardOffcanvasMenu"
                      >
                        <i className="fa fa-bars pr10"></i> Dashboard Navigation
                      </button>
                    </div>
                  </div>
                </div>
                {/* End Dashboard Navigation */}

                <div className="col-lg-12 mb10">
                  <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">Howdy, {userName}</h2>
                    <p>We are glad to see you again!</p>
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <AllStatistics />
              </div>
              {/* End .row Dashboard top statistics */}

              <div className="row ">
                <div className="col-xl-6 col-lg-6 col-md-12">
                  <div className="application_statics">
                    <h4 className="mb-10">Monthly Sales</h4>
                    <SoldTaxLiensStatisticsChart />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-12">
                  <div className="application_statics">
                    <h4 className="mb-10">Monthly Views</h4>
                    <ListingViewsStatisticsChart />
                  </div>
                </div>
                {/* End statistics chart */}

                {/* <div className="col-xl-5">
                  <div className="recent_job_activity">
                    <h4 className="title mb-4">Recent Activities</h4>
                    <Activities />
                  </div>
                </div> */}
              </div>
              {/* End .row  */}

              
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
