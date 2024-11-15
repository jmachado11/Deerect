import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const ListingCard = ({ 
  item, 
  offerAmount, 
  onOfferChange, 
  onOfferSubmit, 
  onFavorite, 
  isGridView 
}) => {
  const supabase = createClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getCurrentUser();
  }, []);

  const handleScrapedFavorite = async () => {
    if (!user) {
      alert('Please sign in to save this listing.');
      return;
    }

    try {
      // Check if address already exists for this user
      const { data: existingAddresses, error: checkError } = await supabase
        .from('Interested Scraped Address')
        .select('id')
        .eq('address', item.property_address)
        .eq('user', user.id);

      if (checkError) {
        console.error('Error checking address:', checkError);
        alert('Failed to check the listing. Please try again.');
        return;
      }

      // If address already exists (array has items), alert user and return
      if (existingAddresses && existingAddresses.length > 0) {
        alert('This address is already saved to your interests.');
        return;
      }

      // If address doesn't exist, save it
      const { error: insertError } = await supabase
        .from('Interested Scraped Address')
        .insert({
          address: item.property_address,
          user: user.id
        });

      if (insertError) {
        console.error('Error saving address:', insertError);
        alert('Failed to save the listing. Please try again.');
        return;
      }

      alert('You will be notified when this Lien begins accepting offers');
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div
      className={`${isGridView ? "col-12 feature-list" : "col-md-6 col-lg-6"}`}
    >
      <div
        className={`feat_property home7 style4 ${
          isGridView ? "d-flex align-items-center" : ""
        }`}
      >
        <div className="details">
          <div className="tc_content">
            <p className="text-thm">{item.property_type}</p>
            <h4>
              Interest Rate: {item.interest_rate}
            </h4>
            <p>
              <span className="flaticon-placeholder"></span>
              {item.property_address}
            </p>

            <ul className="prop_details mb0">
              <li className="list-inline-item">
                <a href="#">County: {item.county}</a>
              </li>
              <li className="list-inline-item">
                <a href="#">Property Condition: {item.property_condition}</a>
              </li>
              <li className="list-inline-item">
                <a href="#">Property Value: {item.property_value}</a>
              </li>
              <li className="list-inline-item">
                <a href="#">Amount Owed: {item.amount_owed}</a>
              </li>
              {!item.isScraped && (
                <li className="list-inline-item">
                  <a href="#">
                    Redemption Date: {new Date(item.redemption_date).toLocaleDateString()}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="fp_footer">
            <div className="fp_pdate float-end d-flex align-items-center gap-2">
              {!user && (
                <a href='/login' className="btn btn-outline-primary">
                  Sign In To Save
                </a>
              )}
              
              {user && !item.isScraped && (
                <>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter offer amount"
                    value={offerAmount}
                    onChange={(e) => onOfferChange(e.target.value)}
                    style={{ width: '150px' }}
                  />
                  <button 
                    onClick={onOfferSubmit}
                    className="btn btn-primary"
                  >
                    Make Offer
                  </button>
                  <span 
                    onClick={onFavorite} 
                    className="btn btn-primary flaticon-heart"
                  ></span>
                </>
              )}

              {user && item.isScraped && (
                <span 
                  onClick={handleScrapedFavorite} 
                  className="btn btn-primary flaticon-heart"
                ></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;