function DescriptionPage() {
  return (
    <div className="description-page">
      <div className="description-page-title">
        <h2>Designed for Security, Built for Simplicity</h2>
        <h3>
          Deerect is a modern platform built to simplify and streamline the tax
          lien investing process, offering exclusive<br className="description-h3-break"></br>listings, smart
          tools, and a seamless experience for both new and seasoned investors.
        </h3>
      </div>
      <div className="description-page-card-container">
        <div className="description-page-card">
          <div>
            <img src="/assets/images/waitlist/map.png"></img>
          </div>
          <h4>Exclusive Investment Opportunities</h4>
          <p>
            Access a curated selection of verified tax lien listings you won’t
            find on public databases
          </p>
        </div>
        <div className="description-page-card">
          <div>
            <img src="/assets/images/waitlist/file.png"></img>
          </div>
          <h4>Bid with Confidence</h4>
          <p>
            Make offers directly through the platform with our easy-to-use
            bidding tools, real-time updates, and transparent processes.
          </p>
        </div>
        <div className="description-page-card">
          <div>
            <img src="/assets/images/waitlist/laptop.png"></img>
          </div>
          <h4>Simple, Seamless Experience</h4>
          <p>
            Easily browse, research, and bid with our intuitive platform
            designed for investors of all experience levels.
          </p>
        </div>
        <div className="description-page-card">
          <div>
            <img src="/assets/images/waitlist/graph.png"></img>
          </div>
          <h4>Data-Driven Insights & Smart Decisions</h4>
          <p>
            Make informed investments with our market analysis and risk
            assessments, giving you confidence in every deal.
          </p>
        </div>
      </div>
      <div className="faq-container">
        <h3>Frequently Asked Questions</h3>
        <div className="faqs-grid">
          <div className="faq">
            <img src="/assets/images/waitlist/plus.png"></img>
            <div className="faq-text">
              <h5>What is Deerect?</h5>
              <p>
                Deerect is a digital marketplace for buying, selling, and
                managing tax lien investments. We bring liquidity, efficiency,
                and data-driven tools to an otherwise opaque and fragmented
                asset class. 
              </p>
            </div>
          </div>
          <div className="faq">
            <img src="/assets/images/waitlist/plus.png"></img>
            <div className="faq-text">
              <h5>What are tax liens?</h5>
              <p>
                A tax lien is a legal claim placed by a government entity when
                property taxes go unpaid. Investors can buy these liens and earn
                interest when the property owner pays their taxes—or potentially
                acquire the property if they don’t.
              </p>
            </div>
          </div>
          <div className="faq">
            <img src="/assets/images/waitlist/plus.png"></img>
            <div className="faq-text">
              <h5>Who can use Deerect?</h5>
              <p>
                Deerect is built for both institutional investors and
                individuals interested in alternative real estate assets.
                Whether you’re new to tax liens or manage a large portfolio, our
                tools simplify the process.
              </p>
            </div>
          </div>
          <div className="faq">
            <img src="/assets/images/waitlist/plus.png"></img>
            <div className="faq-text">
              <h5>How does Deerect make tax lien investing easier?</h5>
              <p>
                <span style={{ color: "#121212" }}>•</span> Centralized
                marketplace for finding and trading liens<br></br>
                <span style={{ color: "#121212" }}>•</span> Portfolio management
                tools to track returns and redemptions
                <br></br>
                <span style={{ color: "#121212" }}>•</span> Automated due
                diligence powered by data<br></br>
                <span style={{ color: "#121212" }}>• </span>
                 Faster exits through a built-in secondary market
              </p>
            </div>
          </div>
          <div className="faq">
            <img src="/assets/images/waitlist/plus.png"></img>
            <div className="faq-text">
              <h5>How do I get started?</h5>
              <p>
                Simply sign up at{" "}
                <a href="deerect.net" className="">
                  deerect.net
                </a>{" "}
                and join the waitlist. We’ll notify you when the platform is
                live and walk you through onboarding.
              </p>
            </div>
          </div>
          <div className="faq">
            <img src="/assets/images/waitlist/plus.png"></img>
            <div className="faq-text">
              <h5>How do I get started?</h5>
              <p>
                Simply sign up at{" "}
                <a href="deerect.net" className="">
                  deerect.net
                </a>{" "}
                and join the waitlist. We’ll notify you when the platform is
                live and walk you through onboarding.
              </p>
            </div>
          </div>
          <div className="faq">
            <img src="/assets/images/waitlist/plus.png"></img>
            <div className="faq-text">
              <h5>Is there a minimum investment amount?</h5>
              <p>
                Minimums may vary depending on the lien, but most opportunities
                start at just a few hundred dollars.
              </p>
            </div>
          </div>
          <div className="faq">
            <img src="/assets/images/waitlist/plus.png"></img>
            <div className="faq-text">
              <h5>How does Deerect make money?</h5>
              <p>
                We charge a small transaction fee on trades and may offer
                premium features for portfolio analytics, tax servicing, or
                early access to deals.
              </p>
            </div>
          </div>
          <div className="faq">
            <img src="/assets/images/waitlist/plus.png"></img>
            <div className="faq-text">
              <h5>Is this available in all states?</h5>
              <p>
                Deerect is gradually expanding. Currently, we support select
                counties in tax lien states, and we’re constantly adding more.
              </p>
            </div>
          </div>
          <div className="faq">
            <img src="/assets/images/waitlist/plus.png"></img>
            <div className="faq-text">
              <h5>Can I sell my tax lien on Deerect?</h5>
              <p>
                Yes. Our secondary marketplace allows lienholders to list and
                sell their positions to other verified investors—improving
                liquidity in a traditionally illiquid market.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DescriptionPage;
