import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { loadScrapedListings } from './listingDataLoader';
import ListingCard from './ListingCard';
import Header from "../../common/header/DefaultHeader";
import MobileMenu from "../../common/header/MobileMenu";
import CopyrightFooter from "../../common/footer/CopyrightFooter";
import BreadCrumb2 from "./BreadCrumb2";

const ITEMS_PER_PAGE = 10;

const Index = () => {
  const supabase = createClient();
  const [getState, setState] = useState("AL");
  const [listings, setListings] = useState([]);
  const [isGridOrList, setIsGridOrList] = useState(true);
  const [offerAmounts, setOfferAmounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const US_STATES = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Get current user (if any)
        const { data: { user } } = await supabase.auth.getUser();
        
        // Fetch from Supabase - modify query based on user status
        const query = supabase.from('Listing').select('*').eq('state', getState);
        
        // Only filter by owner_id if user is logged in
        if (user) {
          query.neq('owner_id', user.id);
        }
        
        const { data: supabaseListings, error } = await query;

        if (error) {
          console.error('Error fetching listings:', error);
          return;
        }

        // Only record views if user is logged in
        if (user) {
          const now = new Date();
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

          await Promise.all(supabaseListings.map(async (item) => {
            const { data: existingViews } = await supabase
              .from('Listing Views')
              .select('id')
              .eq('listing_id', item.id)
              .gte('created_at', startOfDay)
              .limit(1);

            if (!existingViews?.length) {
              await supabase
                .from('Listing Views')
                .insert({ listing_id: item.id });
            }
          }));
        }

        // Load scraped listings
        const scrapedListings = loadScrapedListings(getState);
        
        // Combine and set all listings
        const allListings = [...supabaseListings, ...scrapedListings];
        setListings(allListings);
        
        // Initialize offer amounts
        const initialOfferAmounts = {};
        supabaseListings.forEach(item => {
          initialOfferAmounts[item.id] = '';
        });
        setOfferAmounts(initialOfferAmounts);

      } catch (error) {
        console.error('Unexpected error:', error);
        // Set empty listings array in case of error to prevent undefined state
        setListings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [getState]);

  const handleFavorite = async (listingId) => {
    const { data, error: authError } = await supabase.auth.getUser();
    
    if (authError || !data?.user) {
      alert('Please sign in to add favorites.');
      return;
    }
    try {
      const { error } = await supabase
        .from('Favorite')
        .insert({ listing_id: listingId, user_id: data.user.id });
      if (error) {
        if (error.code === '23505') { 
          alert('Listing already in your favorites.');
        } else {
          alert('Failed to add favorite. Please try again.');
        }
        return;
      }
      alert('Listing added to favorites!');
    } catch (err) {
      alert('An unexpected error occurred. Please try again.');
    }
  };
  

  const handleOffer = async (listingId) => {
    const user = supabase.auth.getUser();
    if (!user) {
      alert('Please sign in to make an offer.');
      return;
    }

    const offerAmount = offerAmounts[listingId];
    if (!offerAmount || isNaN(offerAmount)) {
      alert('Please enter a valid offer amount.');
      return;
    }

    try {
      const { error } = await supabase
        .from('Offer')
        .insert({
          listing_id: listingId,
          offer_amount: parseFloat(offerAmount),
          status: 'PENDING'
        });

      if (error) {
        alert('Failed to submit offer. Please try again.');
      } else {
        alert('Offer submitted successfully!');
        setOfferAmounts(prev => ({
          ...prev,
          [listingId]: ''
        }));
      }
    } catch (err) {
      alert('An unexpected error occurred. Please try again.');
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(listings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentListings = listings.slice(startIndex, endIndex);

  return (
    <>
      <Header />
      <MobileMenu />

      <section className="our-listing bgc-f7 pb30-991 mt85 md-mt0 w-full">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <BreadCrumb2 />
            </div>
          </div>

          <div className="row">
  {/* Add the dropdown here */}
  <div className="col-md-12 col-lg-8">
    <div className="grid_list_search_result">
      <div className="row align-items-center">
        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-5">
          <div className="left_area tac-xsd">
            <p>
              {loading ? (
                "Loading..."
              ) : (
                <span>
                  {listings.length} Search results
                </span>
              )}
            </p>
          </div>
        </div>
        {/* Add the state dropdown */}
        <div className="col-sm-12 col-md-8 col-lg-8 col-xl-7">
          <div className="right_area text-end tac-xsd">
            <select 
              value={getState} 
              onChange={(e) => setState(e.target.value)}
              className="form-select"
              style={{ maxWidth: '200px', display: 'inline-block' }}
            >
              {US_STATES.map((state) => (
                <option key={state.value} value={state.value}>{state.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
              <div className="row">
                {currentListings.map((item) => (
                  <ListingCard
                    key={item.id}
                    item={item}
                    offerAmount={offerAmounts[item.id] || ''}
                    onOfferChange={(value) => setOfferAmounts(prev => ({
                      ...prev,
                      [item.id]: value
                    }))}
                    onOfferSubmit={() => handleOffer(item.id)}
                    onFavorite={() => handleFavorite(item.id)}
                    isGridView={isGridOrList}
                  />
                ))}
              </div>

              {/* Pagination */}
              {/* Pagination */}
              <div className="row">
                <div className="col-lg-12 mt-3">
                  <div className="mbp_pagination">
                    <ul className="page_navigation">
                      {/* First page / Skip backward 10 */}
                      <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 10))}
                          disabled={currentPage <= 1}
                        >
                          &laquo;
                        </button>
                      </li>

                      {/* Previous 5 pages */}
                      <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 5))}
                          disabled={currentPage <= 1}
                        >
                          &lsaquo;
                        </button>
                      </li>

                      {/* Page numbers */}
                      {(() => {
                        const pageNumbers = [];
                        let startPage = Math.max(1, Math.min(currentPage - 4, totalPages - 9));
                        let endPage = Math.min(startPage + 9, totalPages);
                        
                        // Adjust startPage if we're near the end to always show 10 pages if possible
                        if (endPage - startPage < 9 && startPage > 1) {
                          startPage = Math.max(1, endPage - 9);
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pageNumbers.push(
                            <li 
                              key={i} 
                              className={`page-item ${currentPage === i ? 'active' : ''}`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(i)}
                              >
                                {i}
                              </button>
                            </li>
                          );
                        }
                        return pageNumbers;
                      })()}

                      {/* Next 5 pages */}
                      <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 5))}
                          disabled={currentPage >= totalPages}
                        >
                          &rsaquo;
                        </button>
                      </li>

                      {/* Last page / Skip forward 10 */}
                      <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 10))}
                          disabled={currentPage >= totalPages}
                        >
                          &raquo;
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="footer_middle_area pt40 pb40">
        <div className="container">
          <CopyrightFooter />
        </div>
      </section>
    </>
  );
};

export default Index;