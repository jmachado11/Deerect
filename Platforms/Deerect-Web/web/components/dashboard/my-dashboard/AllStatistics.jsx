'use client';
import { createClient } from '@/utils/supabase/client';
import React, { useState, useEffect } from 'react';

const AllStatistics = () => {
  const [activeListingCount, setActiveListingCount] = useState('...');
  const [soldListingCount, setSoldListingCount] = useState('...');
  const [totalOffers, setTotalOffers] = useState('...');
  const [totalViews, setTotalViews] = useState('...');
  const [totalFavorites, setTotalFavorites] = useState('...');

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      try {
        // Get the current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error('Error fetching user:', userError);
          // Handle unauthenticated user as needed
          return;
        }

        const userId = user.id;

        // Fetch active listings count
        const { count: activeCount, error: activeError } = await supabase
          .from('Listing')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Active')
          .eq('owner_id', userId);

        if (activeError) {
          console.error('Error fetching active listing count:', activeError);
          setActiveListingCount(0);
        } else {
          setActiveListingCount(activeCount || 0);
        }

        // Fetch sold listings count
        const { count: soldCount, error: soldError } = await supabase
          .from('Listing')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Sold')
          .eq('owner_id', userId);

        if (soldError) {
          console.error('Error fetching sold listing count:', soldError);
          setSoldListingCount(0);
        } else {
          setSoldListingCount(soldCount || 0);
        }

        // Fetch listing IDs owned by the user
        const { data: userListings, error: listingsError } = await supabase
          .from('Listing')
          .select('id')
          .eq('owner_id', userId);

        if (listingsError || !userListings) {
          console.error('Error fetching user listings:', listingsError);
          setTotalOffers(0);
          setTotalViews(0);
          setTotalFavorites(0);
        } else {
          const listingIds = userListings.map((listing) => listing.id);
          console.log('listingIds:', listingIds);

          if (listingIds.length === 0) {
            // The user has no listings
            setTotalOffers(0);
            setTotalViews(0);
            setTotalFavorites(0);
          } else {
            // Fetch total offers for the user's listings
            const { count: offersCount, error: offersError } = await supabase
              .from('Offer')
              .select('*', { count: 'exact', head: true })
              .in('listing_id', listingIds);

            if (offersError) {
              console.error('Error fetching offers count:', offersError);
              setTotalOffers(0);
            } else {
              setTotalOffers(offersCount || 0);
            }

            // Fetch total views for user's listings
            const { count: viewsCount, error: viewsError } = await supabase
              .from('Listing Views')
              .select('*', { count: 'exact', head: true })
              .in('listing_id', listingIds);

            if (viewsError) {
              console.error('Error fetching views count:', viewsError);
              setTotalViews(0);
            } else {
              console.log('viewsCount:', viewsCount);
              setTotalViews(viewsCount || 0);
            }

            // Fetch total favorites for user's listings
            const { count: favoritesCount, error: favoritesError } = await supabase
              .from('Favorite')
              .select('*', { count: 'exact', head: true })
              .in('listing_id', listingIds);

            if (favoritesError) {
              console.error('Error fetching favorites count:', favoritesError);
              setTotalFavorites(0);
            } else {
              setTotalFavorites(favoritesCount || 0);
            }
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setActiveListingCount(0);
        setSoldListingCount(0);
        setTotalOffers(0);
        setTotalViews(0);
        setTotalFavorites(0);
      }
    }

    fetchData();
  }, []);

  const allStatistics = [
    {
      id: 1,
      blockStyle: '',
      icon: 'flaticon-home',
      timer: activeListingCount,
      name: 'Active Tax Liens',
    },
    {
      id: 2,
      blockStyle: 'style5',
      icon: 'flaticon-money-bag',
      timer: soldListingCount,
      name: 'Sold Tax Liens',
    },
    // {
    //   id: 3,
    //   blockStyle: 'style2',
    //   icon: 'flaticon-view',
    //   timer: totalViews,
    //   name: 'Total Views',
    // },
    {
      id: 4,
      blockStyle: 'style3',
      icon: 'flaticon-chat',
      timer: totalOffers,
      name: 'Total Offers',
    },
    // {
    //   id: 5,
    //   blockStyle: 'style4',
    //   icon: 'flaticon-heart',
    //   timer: totalFavorites,
    //   name: 'Total Favorites',
    // },
    
  ];

  return (
    <>
      {allStatistics.map((item) => (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3" key={item.id}>
          <div className={`ff_one ${item.blockStyle}`}>
            <div className="detais">
              <div className="timer">{item.timer}</div>
              <p>{item.name}</p>
            </div>
            <div className="icon">
              <span className={item.icon}></span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AllStatistics;
