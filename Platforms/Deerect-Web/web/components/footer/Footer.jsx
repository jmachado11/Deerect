import "../../public/assets/scss/footer.css";
function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-left">
            <div className="footer-foo">
              <div className="footer-header">
                <img src="/assets/images/waitlist/logo (3).png"></img>
                <h2 className="">Deerect</h2>
              </div>
              <h3>Your gateway to tax lien oppurtunities</h3>
            </div>
            <h4 className="tag">© 2025 by Deerect. All rights reserved.</h4>
          </div>

          <div
          className="footer-right">
            <div>
              <h4>More Deerect</h4>
              <h5>How It Works</h5>
              <h5>Contact Us</h5>
              <h5>FAQs</h5>
              <h5>Investor Resources</h5>
              <h5>Create Listings</h5>
            </div>
            <div>
              <h4>About Deerect</h4>
              <h5>About Us</h5>
              <h5>Partner with us</h5>
              <h5>Privacy Policy</h5>
              <h5>Terms & Conditions</h5>
              <h5>Cookie Policy</h5>
              <h5>Help &amp; Support</h5>
            </div>
          </div>
        </div>
        <hr></hr>
        <div className="footer-bottom">
          <h4 className="sm-tag">© 2025 by Deerect. All rights reserved.</h4>
          <div>
          <i className="fa-brands fa-linkedin"></i>
          <i className="fa-brands fa-instagram"></i>
          <i className="fa-solid fa-inbox"></i>
          <i className="fa-brands fa-twitter"></i>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
