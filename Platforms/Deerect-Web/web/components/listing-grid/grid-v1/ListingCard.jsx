import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import "./listing.css"

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
        className={`feat_property home7 style4 ${isGridView ? "d-flex align-items-center" : ""
          }`}
      >
        <div className="details">
          <div className="tc_content">
            <p className="text-thm">{item.property_type}</p>
            <h4>
              Interest Rate: {item.interest}
            </h4>
            <p>
              <span className="flaticon-placeholder"></span>
              {" "}{item.property_address}
            </p>

            <ul className="prop_details mb0">
              <li className="list-inline-item">
                <a href="#">Property Type: {item.property_type}</a>
              </li>
              <li className="list-inline-item">
                <a href="#">Price: {item.amount_owed}</a>
              </li>
              <li className="list-inline-item">
                {item.type == "PreforclosureNew" ? <a href="#">Mortage Balance{item["Mortgage Balance"]}</a> : null}
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
                <a href='/login' className="btn btn-outline-primary signintosave">
                  Sign In To Save
                </a>
              )}
              {user && item.isScraped && (
                <>
                  <input
                    type="number"
                    className="form-control offerfield"
                    placeholder="Offer Amount"
                    value={offerAmount}
                    onChange={(e) => onOfferChange(e.target.value)}
                    style={{ width: '150px' }}
                  />
                  <button
                    onClick={onOfferSubmit}
                    className="btn offer"
                  >
                    Make Offer
                  </button>
                  <span
                    onClick={onFavorite}
                    className="btn flaticon-heart heart"
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