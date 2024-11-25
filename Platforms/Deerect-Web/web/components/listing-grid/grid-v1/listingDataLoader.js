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
  WY: WYData
};

export const loadScrapedListings = (selectedState) => {
  let allListings = [];

  const stateData = STATE_FILES[selectedState];
  if (!stateData) {
    return allListings;
  }

  const validListings = stateData
    .filter(listing => 
      listing.address && // Ensure the listing has an address
      (listing.type === "Tax Lien" || listing.type === "Preforeclosure") // Include specific types
    )
    .map(listing => ({
      id: `scraped-${listing.url.split('/').pop()}`, // Create unique ID
      property_address: listing.address,
      interest_rate: "not available",
      property_value: listing["Assessed Value:"] || "N/A",
      property_type: listing["property type"] || "N/A",
      city: listing.address.split(' ').slice(-3, -2)[0],
      state: listing.address.split(' ').slice(-2, -1)[0],
      zip_code: listing.address.split(' ').slice(-1)[0],
      county: "N/A",
      amount_owed: listing.price || listing["Mortgage Balance:"] || "N/A",
      property_condition: "N/A",
      isScraped: true // Flag to identify scraped listings
    }));

  allListings = [...allListings, ...validListings];

  return allListings;
};