// utils/listingDataLoader.js
import SDData from "@/data/scrapedListings/SDscraped_data.json";
import WYData from "@/data/scrapedListings/WYscraped_data.json";
import TXData from "@/data/scrapedListings/TXscraped_data.json";
import NJData from "@/data/scrapedListings/NJscraped_data.json";
import IAData from "@/data/scrapedListings/IAscraped_data.json";
import GAData from "@/data/scrapedListings/GAscraped_data.json";
// ... import all state data files

const STATE_FILES = {
  TX: TXData,
  WY: WYData,
  SD: SDData,
  NJ: NJData,
  IA: IAData,
  GA: GAData,
  // ... add all state imports
};

export const loadScrapedListings = () => {
  let allListings = [];
  
  Object.values(STATE_FILES).forEach(stateData => {
    const validListings = stateData
      .filter(listing => 
        listing.address && // Skip if no address
        listing.type === "Tax Lien" // Only include Tax Liens
      )
      .map(listing => ({
        id: `scraped-${listing.url.split('/').pop()}`, // Create unique ID from URL
        property_address: listing.address,
        interest_rate: "not available",
        property_value: listing["Assessed Value:"] || "N/A",
        property_type: listing["property type"] || "N/A",
        city: listing.address.split(' ').slice(-3, -2)[0],
        state: listing.address.split(' ').slice(-2, -1)[0],
        zip_code: listing.address.split(' ').slice(-1)[0],
        county: "N/A",
        amount_owed: listing.price || "N/A",
        property_condition: "N/A",
        isScraped: true // Flag to identify scraped listings
      }));
      
    allListings = [...allListings, ...validListings];
  });
  
  return allListings;
};