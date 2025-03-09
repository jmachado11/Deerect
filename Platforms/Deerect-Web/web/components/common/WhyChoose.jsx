const WhyChoose = ({ style = "" }) => {
  const whyCooseContent = [
    {
      id: 1,
      icon: "flaticon-high-five",
      title: "Our Services",
      descriptions: `We simplify the tax lien process by making it as simple as investing in stocks.`,
    },
    {
      id: 2,
      icon: "flaticon-home-1",
      title: "Wide Renge Of Tax Liens",
      descriptions: `Largest selection of Tax Liens available for purchase anywhere.`,
    },
    {
      id: 3,
      icon: "flaticon-profit",
      title: "No need to travel",
      descriptions: `The entire tax lien investment process is now centralized in one place online.`,
    },
  ];

  return (
    <>
      {whyCooseContent.map((item) => (
        <div className="col-md-6 col-lg-4 col-xl-4" key={item.id}>
          <div className={`why_chose_us ${style}`}>
            <div className="icon">
              <span className={item.icon}></span>
            </div>
            <div className="details">
              <h4>{item.title}</h4>
              <p>{item.descriptions}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default WhyChoose;
