'use client';
import { createClient } from '@/utils/supabase/client';
import React, { useState, useEffect } from 'react';
import Link from "next/link";

const FavouritProducts = () => {
  const [favorites, setFavorites] = useState([]);
  const supabase = createClient();

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('Favorite')
        .select(`
          listing_id,
          Listing (
            id,
            property_type,
            property_address,
            interest_rate
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const deleteFavorite = async (listingId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('Favorite')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      if (error) throw error;
      fetchFavorites(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  let content = favorites.map((item) => (
    <div className="feat_property list favorite_page" key={item.listing_id}>
      <div className="details">
        <div className="tc_content">
          <h4>
            <Link href={`/home/${item.listing_id}`}>
              {item.Listing.property_type}
            </Link>
          </h4>
          <p>
            <span className="flaticon-placeholder"></span> 
            {item.Listing.property_address}
          </p>
          <p className="fp_price text-thm">
            Interest Rate: {item.Listing.interest_rate}%
          </p>
        </div>
      </div>

      <ul className="view_edit_delete_list mb0 mt35">
        <li
          className="list-inline-item"
          data-toggle="tooltip"
          data-placement="top"
          title="Delete"
          onClick={() => deleteFavorite(item.listing_id)}
          style={{ cursor: 'pointer' }}
        >
          <a>
            <span className="flaticon-garbage"></span>
          </a>
        </li>
        {/* <li
          className="list-inline-item"
          data-toggle="tooltip"
          data-placement="top"
          title="View Details"
        >
          <Link href={`/home/${item.listing_id}`}>
            <span className="flaticon-right-arrow"></span>
          </Link>
        </li> */}
      </ul>
    </div>
  ));

  return <>{content}</>;
};

export default FavouritProducts;