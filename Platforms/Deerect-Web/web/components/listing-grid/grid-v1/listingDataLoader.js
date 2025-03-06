// utils/listingDataLoader.js
import ALData from "@/data/scrapedListings/ALscraped_data.json";
import AKData from "@/data/scrapedListings/AKscraped_data.json";
import AZData from "@/data/scrapedListings/AZscraped_data.json";
import ARData from "@/data/scrapedListings/ARscraped_data.json";
import CAData from "@/data/scrapedListings/CAscraped_data.json";
import COData from "@/data/scrapedListings/COscraped_data.json";
import CTData from "@/data/scrapedListings/CTscraped_data.json";
import DEData from "@/data/scrapedListings/DEscraped_data.json";
import FLData from "@/data/scrapedListings/FLscraped_data.json";
import GAData from "@/data/scrapedListings/GAscraped_data.json";
import HIData from "@/data/scrapedListings/HIscraped_data.json";
import IDData from "@/data/scrapedListings/IDscraped_data.json";
import ILData from "@/data/scrapedListings/ILscraped_data.json";
import INData from "@/data/scrapedListings/INscraped_data.json";
import IAData from "@/data/scrapedListings/IAscraped_data.json";
import KSData from "@/data/scrapedListings/KSscraped_data.json";
import KYData from "@/data/scrapedListings/KYscraped_data.json";
import LAData from "@/data/scrapedListings/LAscraped_data.json";
import MEData from "@/data/scrapedListings/MEscraped_data.json";
import MDData from "@/data/scrapedListings/MDscraped_data.json";
import MAData from "@/data/scrapedListings/MAscraped_data.json";
import MIData from "@/data/scrapedListings/MIscraped_data.json";
import MNData from "@/data/scrapedListings/MNscraped_data.json";
import MSData from "@/data/scrapedListings/MSscraped_data.json";
import MOData from "@/data/scrapedListings/MOscraped_data.json";
import MTData from "@/data/scrapedListings/MTscraped_data.json";
import NEData from "@/data/scrapedListings/NEscraped_data.json";
import NVData from "@/data/scrapedListings/NVscraped_data.json";
import NHData from "@/data/scrapedListings/NHscraped_data.json";
import NJData from "@/data/scrapedListings/NJscraped_data.json";
import NMData from "@/data/scrapedListings/NMscraped_data.json";
import NYData from "@/data/scrapedListings/NYscraped_data.json";
import NCData from "@/data/scrapedListings/NCscraped_data.json";
import NDData from "@/data/scrapedListings/NDscraped_data.json";
import OHData from "@/data/scrapedListings/OHscraped_data.json";
import OKData from "@/data/scrapedListings/OKscraped_data.json";
import ORData from "@/data/scrapedListings/ORscraped_data.json";
import PAData from "@/data/scrapedListings/PAscraped_data.json";
import RIData from "@/data/scrapedListings/RIscraped_data.json";
import SCData from "@/data/scrapedListings/SCscraped_data.json";
import SDData from "@/data/scrapedListings/SDscraped_data.json";
import TNData from "@/data/scrapedListings/TNscraped_data.json";
import TXData from "@/data/scrapedListings/TXscraped_data.json";
import UTData from "@/data/scrapedListings/UTscraped_data.json";
import VTData from "@/data/scrapedListings/VTscraped_data.json";
import VAData from "@/data/scrapedListings/VAscraped_data.json";
import WAData from "@/data/scrapedListings/WAscraped_data.json";
import WVData from "@/data/scrapedListings/WVscraped_data.json";
import WIData from "@/data/scrapedListings/WIscraped_data.json";
import WYData from "@/data/scrapedListings/WYscraped_data.json";


// Mapping of state abbreviations to their data files
const STATE_FILES = {
  AL: ALData,
  AK: AKData,
  AZ: AZData,
  AR: ARData,
  CA: CAData,
  CO: COData,
  CT: CTData,
  DE: DEData,
  FL: FLData,
  GA: GAData,
  HI: HIData,
  ID: IDData,
  IL: ILData,
  IN: INData,
  IA: IAData,
  KS: KSData,
  KY: KYData,
  LA: LAData,
  ME: MEData,
  MD: MDData,
  MA: MAData,
  MI: MIData,
  MN: MNData,
  MS: MSData,
  MO: MOData,
  MT: MTData,
  NE: NEData,
  NV: NVData,
  NH: NHData,
  NJ: NJData,
  NM: NMData,
  NY: NYData,
  NC: NCData,
  ND: NDData,
  OH: OHData,
  OK: OKData,
  OR: ORData,
  PA: PAData,
  RI: RIData,
  SC: SCData,
  SD: SDData,
  TN: TNData,
  TX: TXData,
  UT: UTData,
  VT: VTData,
  VA: VAData,
  WA: WAData,
  WV: WVData,
  WI: WIData,
  WY: WYData,
};
const stateRates = {
  AL: 7.750,
  AK: 7.813,
  AZ: 7.750,
  AR: 7.875,
  CA: 7.750,
  CO: 7.750,
  CT: 7.875,
  DE: 7.750,
  FL: 7.625,
  GA: 7.625,
  HI: 7.875,
  ID: 7.875,
  IL: 7.750,
  IN: 7.875,
  IA: 7.875,
  KS: 7.875,
  KY: 7.700,
  LA: 7.813,
  ME: 7.875,
  MD: 7.750,
  MA: 7.875,
  MI: 7.750,
  MN: 7.875,
  MS: 7.875,
  MO: 7.875,
  MT: 7.875,
  NE: 7.875,
  NV: 7.750,
  NH: 7.875,
  NJ: 7.700,
  NM: 7.875,
  NY: 7.875,
  NC: 7.662,
  ND: 7.875,
  OH: 7.875,
  OK: 7.750,
  OR: 7.875,
  PA: 7.750,
  RI: 7.875,
  SC: 7.750,
  SD: 7.875,
  TN: 7.700,
  TX: 7.550,
  UT: 7.875,
  VT: 7.875,
  VA: 7.750,
  WA: 7.875,
  WV: 7.750,
  WI: 7.875,
  WY: 7.875
};

export const loadScrapedListings = (selectedState) => {
  let allListings = [];


  const stateData = STATE_FILES[selectedState];
  if (!stateData) {
    return allListings;
  }

  const validListings = 
    stateData
      .filter(
        (listing) =>
          listing.address && 
          (listing.type === "Tax Lien" || listing.type === "Preforeclosure" || listing.type == "PreforeclosureNEW") 
      )
      .map(listing => (
        {
          id: `scraped-${listing.url.split("/").pop()}`,
          property_address: listing.address,
          type: listing.type,
          property_value: listing["Assessed Value:"] || "N/A",
          property_type: listing["property type"] || "N/A",
          city: listing.address.split(" ").slice(-3, -2)[0],
          state: listing.address.split(" ").slice(-2, -1)[0],
          zip_code: listing.address.split(" ").slice(-1)[0],
          county: "N/A", 
          amount_owed: listing.price || listing["Mortgage Balance:"] || "N/A",
          isScraped: true,
          interest: stateRates[selectedState] + '%',
        }));


  allListings = [...allListings, ...validListings];

  return allListings;
};
