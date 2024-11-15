'use client'

import Link from "next/link";

import {
  isParentPageActive,
  isSinglePageActive,
} from "../../../../utils/daynamicNavigation";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signout } from "@/lib/auth-actions";


const SidebarMenu = () => {
  const pathname = usePathname()


 
  const manageAccount = [

    {
      id: 2,
      name: "My Profile",
      route: "/my-profile",
      icon: "flaticon-user",
    },
    { id: 3, name: "Logout", route: "/login", icon: "flaticon-logout" },
  ];
  
  const handleSignOut = async () => {
    try {
      await signout();
    } catch (error) {
      console.error('Error signing out:', error)
    }
    
    
  };

  return (
    <>
      <ul className="sidebar-menu">
        <li className="sidebar_header header">
          <Link href="/">
            <Image
              width={230}
              height={150}
              src="/assets/images/Deerect (white red).png"
              alt="header-logo2.png"
            />
            
          </Link>
        </li>
        {/* End header */}

        <li className="title">
          <span>Insight</span>
          <ul>
            <li
              className={`treeview ${
                isSinglePageActive("/my-dashboard", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-dashboard">
                <i className="flaticon-layers"></i>
                <span> Dashboard</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/create-listing", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/create-listing">
                <i className="flaticon-plus"></i>
                <span> Create Listing</span>
              </Link>
            </li>

            <li
              className={`treeview ${
                isSinglePageActive("/my-properties", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-properties">
                <i className="flaticon-home"></i>
                <span> My Properties</span>
              </Link>
            </li>
            {/* end properties */}
            <li
              className={`treeview ${
                isSinglePageActive("/my-offers", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-offers">
                <i className="flaticon-envelope"></i>
                <span>Offers</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/my-favourites", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-favourites">
                <i className="flaticon-magnifying-glass"></i>
                <span> My Favorites</span>
              </Link>
            </li>
          </ul>
        </li>
        {/* End Main */}

        {/* <li className="title">
          <span>Buying</span>
          <ul>
            

            <li
              className={`treeview ${
                isParentPageActive(reviews, pathname) ? "active" : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#review">
                <i className="flaticon-chat"></i>
                <span>Reviews</span>
                <i className="fa fa-angle-down pull-right"></i>
              </a>
              <ul className="treeview-menu collapse" id="review">
                {reviews.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li
              className={`treeview ${
                isSinglePageActive("/my-favourites", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-favourites">
                <i className="flaticon-magnifying-glass"></i>
                <span> My Favorites</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/my-saved-search", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-saved-search">
                <i className="flaticon-magnifying-glass"></i>
                <span> Saved Search</span>
              </Link>
            </li>
          </ul>
        </li> */}
        {/* End manage listing */}

        <li className="title">
          <span>Manage Account</span>
          <ul>
            {manageAccount.map((item) => (
              <li
                className={
                  isSinglePageActive(item.route, pathname) ? "active" : ""
                }
                key={item.id}
              >
                {item.name === "Logout" ? (
                  <a onClick={handleSignOut} style={{ cursor: "pointer" }}>
                    <i className={item.icon}></i> <span>{item.name}</span>
                  </a>
                ) : (
                  <Link href={item.route}>
                    <i className={item.icon}></i> <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </>
  );
};

export default SidebarMenu;
