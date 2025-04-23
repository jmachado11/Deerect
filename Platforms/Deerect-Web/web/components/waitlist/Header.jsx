import { useEffect, useState } from "react";
import Link from "next/link";
import "../../public/assets/scss/waitlist.css";
import Contact from "./Contact";

function Header() {
  const [scrollTop, setScrollTop] = useState(true);
  const [active, setActive] = useState("home");
  const [menuActive, setMenuActive] = useState(false);
  const [contactActive, setContactActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY === 0);
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const menu = document.querySelector(".header-menu-sm");
      if (menu && !menu.contains(e.target)) {
        setMenuActive(false);
      }
    };
  
    if (menuActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuActive]);

  const toggleMenu=()=>{
    setMenuActive(prev=>!prev);
  }
  const toggleContact=()=>{
    setContactActive(prev=>!prev);
    setMenuActive(false);
  }
  return (
    <>
      {/*<div className={`sm-header-menu ${menuActive?"sm-header-menu-active":""}`}>
        <div className="sm-header-menu-header">
          <img src="/assets/images/waitlist/logo (3).png"></img>
          <i onClick={toggleMenu} className="fa-solid fa-multiply"></i>
        </div>
        <div className="sm-header-menu-body">
          <div className="sm-header-link">
            <h2>Home</h2>
            <div className="double-chevron">
              <i className="fa-solid fa-chevron-right"></i>
              <i className="fa-solid fa-chevron-right"></i>
            </div>
          </div>
          <div className="sm-header-link">
            <h2>Community</h2>
            <div className="double-chevron">
              <i className="fa-solid fa-chevron-right"></i>
              <i className="fa-solid fa-chevron-right"></i>
            </div>
          </div>
          <div className="sm-header-link">
            <h2>Contact</h2>
            <div className="double-chevron">
              <i className="fa-solid fa-chevron-right"></i>
              <i className="fa-solid fa-chevron-right"></i>
            </div>
          </div>
          <div className="sm-header-join">
            <h2>Join the waitlist</h2>
          </div>
        </div>
      </div>*/}
      <div
        className="header-container"
        style={
          !scrollTop || active === "contact"
            ? {
                backgroundColor: "#121212",
                borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                opacity: 0.95,
              }
            : {}
        }
      >
        <div className="header-left">
          <img src="/assets/images/waitlist/logo (3).png"></img>
          <div>Deerect</div>
        </div>
        {/*<div className="header-middle">
          <div>
            <Link
              onClick={() => changeRoute("home")}
              className={`header-link ${
                active === "home" ? "header-active" : "header-link"
              }`}
              href="/waitlist"
            >
              Home
            </Link>
            {active === "home" ? <span className="active-line"></span> : ""}
          </div>

          <div>
            <Link
              onClick={() => changeRoute("community")}
              className={`${
                active === "community" ? "header-active" : "header-link"
              }`}
              href="/waitlist"
            >
              Community
            </Link>
            {active === "community" ? (
              <span className="active-line"></span>
            ) : (
              ""
            )}
          </div>

          <div>
            <Link
              onClick={() => changeRoute("contact")}
              className={`${
                active === "contact" ? "header-active" : "header-link"
              }`}
              href="/contact"
            >
              Contact
            </Link>
            {active === "contact" ? <span className="active-line"></span> : ""}
          </div>
        </div>*/}
        <div className="header-right">
          <div className={`header-menu-sm ${menuActive?'header-menu-sm-active':''}`}>
            <i onClick={toggleMenu} className="fa-solid fa-bars header-menu-bars"></i>
            <div className={`header-sm-buttons ${menuActive?'header-sm-buttons-active':''}`}>
              <button onClick={toggleContact} className="contact-button-sm">Contact us</button>
              <a  href="https://discord.gg/ZDKg7X3w" target="_blank" rel="noopener noreferrer" className="join-community-sm">Join the community</a>
            </div>
          </div>
          <button onClick={toggleContact} className="contact-button">Contact us</button>
          <a  href="https://discord.gg/ZDKg7X3w" target="_blank" rel="noopener noreferrer" className="join-community">Join the community</a>
        </div>
      </div>
      {
        contactActive?<Contact toggleContact={toggleContact}/>:''
      }
    </>
  );
}

export default Header;
