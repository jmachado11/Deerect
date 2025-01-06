const Pricing = () => {
  const pricingContent = [
    {
      id: 1,
      price: "Free",
      title: "Standard",
      features: [
        "Unlimited Tax Lien Listings",
        "Unlimited Tax Lien Purchases",
        "24/7 Customer Support",
        
      ],
      isCurrentPlan: true,
    },
    {
      id: 2,
      price: "Contact Us",
      title: "Pro",
      features: [
        "Free Plan Features",
        "Data Insights",
        "Financing",
      ],
      isCurrentPlan: false,
    },
    {
      id: 3,
      price: "Contact Us",
      title: "Enterprise",
      features: [
        "Unlimited API Access",
        "Access To Beta Features",
        "Dedicated Customer Support",
        
      ],
      isCurrentPlan: false,
    },
  ];
  return (
    <>
      {pricingContent.map((item) => (
        <div className="col-sm-6 col-md-6 col-lg-4" key={item.id}>
          <div className="pricing_table">
            <div className="pricing_header">
              <div className="price">{item.title}</div>
              
            </div>
            <div className="pricing_content">
              <h4>Details</h4>
              <ul className="mb0">
                {item.features.map((val, i) => (
                  <li key={i}>{val}</li>
                ))}
              </ul>
            </div>
            <div className="pricing_footer">
              <a className={item.isCurrentPlan ? "pricing_btn btn-block" : "btn pricing_btn btn-block"} href={item.isCurrentPlan ? "#" : "/contact"}>
                {item.isCurrentPlan ? "Current Plan" : "Contact Us"}
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Pricing;
