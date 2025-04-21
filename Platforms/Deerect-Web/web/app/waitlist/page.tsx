'use client'
import HomeMain from "@/components/home";
import GridV1 from "@/components/listing-grid/grid-v1";
import Footer from "@/components/footer/Footer";
import WaitlistPage from "@/components/waitlist/WaitlistPage";
const metadata = {
  title: 'Home-1 || FindHouse - Real Estate React Template',
  description:
    'FindHouse - Real Estate React Template',
}

const index = () => {
  return (
    <>
      <WaitlistPage/>
    </>
  );
};

export default index;