import GlobalFilter from "./GlobalFilter";

const GlobalHeroFilter = ({ className = "" }) => {
  return (
    <div className={`home_adv_srch_opt ${className}`}>
      <ul className="nav nav-pills" id="pills-tab" role="tablist">
        <li className="nav-item">
          <a
            className="nav-link "
            
            href="/listings"
            
          >
            Buy Now &nbsp;&nbsp;<span className="flaticon-right-arrow"></span>
          </a>
          
        </li>

        
      </ul>
      {/* End nav-pills */}

      {/* <div className="tab-content home1_adsrchfrm" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
          <GlobalFilter />
        </div>
        <div
          className="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <GlobalFilter />
        </div>
      </div> */}
    </div>
  );
};

export default GlobalHeroFilter;
