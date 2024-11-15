'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const OffersView = () => {
  const [receivedOffers, setReceivedOffers] = useState([]);
  const [sentOffers, setSentOffers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingOfferIds, setUpdatingOfferIds] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchAllOffers = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError('You must be logged in to view offers.');
          return;
        }

        const userId = user.id;

        // Fetch listings owned by the user
        const { data: userListings } = await supabase
          .from('Listing')
          .select('id, property_address')
          .eq('owner_id', userId);

        if (userListings && userListings.length > 0) {
          const listingIds = userListings.map((listing) => listing.id);

          // Fetch offers received on user's listings
          const { data: receivedOffersData } = await supabase
            .from('Offer')
            .select(`
              id,
              created_at,
              offer_amount,
              listing_id,
              buyer_id,
              status,
              Listing:listing_id (
                property_address
              )
            `)
            .in('listing_id', listingIds)
            .in('status', ['PENDING', 'ACCEPTED', 'REJECTED'])
            .order('created_at', { ascending: false });

          setReceivedOffers(receivedOffersData || []);
        }

        // Fetch offers sent by the user
        const { data: sentOffersData } = await supabase
          .from('Offer')
          .select(`
            id,
            created_at,
            offer_amount,
            listing_id,
            buyer_id,
            status,
            Listing:listing_id (
              property_address
            )
          `)
          .eq('buyer_id', userId)
          .order('created_at', { ascending: false });

        setSentOffers(sentOffersData || []);

      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllOffers();
  }, [supabase]);

  // Filter received offers based on status
  const pendingReceivedOffers = receivedOffers.filter((offer) => offer.status === 'PENDING');
  const acceptedReceivedOffers = receivedOffers.filter((offer) => offer.status === 'ACCEPTED');
  const rejectedReceivedOffers = receivedOffers.filter((offer) => offer.status === 'REJECTED');

  const updateOfferStatus = async (offerId, newStatus) => {
    try {
      setUpdatingOfferIds((prev) => [...prev, offerId]);

      const { error } = await supabase
        .from('Offer')
        .update({ status: newStatus })
        .eq('id', offerId);

      if (error) {
        console.error(`Error updating offer ${offerId}:`, error);
        alert(`Failed to update offer status. Please try again.`);
      } else {
        setReceivedOffers((prevOffers) =>
          prevOffers.map((offer) =>
            offer.id === offerId ? { ...offer, status: newStatus } : offer
          )
        );
      }
    } catch (err) {
      console.error(`Unexpected error updating offer ${offerId}:`, err);
      alert('An unexpected error occurred while updating the offer.');
    } finally {
      setUpdatingOfferIds((prev) => prev.filter((id) => id !== offerId));
    }
  };

  const handleAcceptOffer = (offerId) => {
    if (window.confirm('Are you sure you want to accept this offer?')) {
      updateOfferStatus(offerId, 'ACCEPTED');
    }
  };

  const handleRejectOffer = (offerId) => {
    if (window.confirm('Are you sure you want to reject this offer?')) {
      updateOfferStatus(offerId, 'REJECTED');
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (loading) return <h2>Loading offers...</h2>;

  return (
    <div className="flex flex-row space-x-4 p-4">
      {/* Left side - Received Offers */}
      <div className=" flex flex-col space-y-8">
        <h2 className="text-2xl font-bold">Offers Received</h2>
        
        <div className="w-full">
          <span className="text-xl font-semibold mb-2">Pending Offers</span>
          {pendingReceivedOffers.length > 0 ? (
            <table className="w-full bg-white border table-fixed">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Property</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingReceivedOffers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="py-2 px-4 border-b">${offer.offer_amount.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{offer.Listing.property_address}</td>
                    <td className="py-2 px-4 border-b">{new Date(offer.created_at).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      <button 
                        onClick={() => handleAcceptOffer(offer.id)}
                        disabled={updatingOfferIds.includes(offer.id)}
                        className="mr-2 bg-white border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold py-1 px-2 rounded transition-colors duration-200"
                      >
                        {updatingOfferIds.includes(offer.id) ? 'Accepting...' : 'Accept'}
                      </button>
                      <button 
                        onClick={() => handleRejectOffer(offer.id)}
                        disabled={updatingOfferIds.includes(offer.id)}
                        className="bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-1 px-2 rounded transition-colors duration-200"
                      >
                        {updatingOfferIds.includes(offer.id) ? 'Rejecting...' : 'Reject'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>-</p>
          )}
        </div>

        <div className="w-full">
          <span className="text-xl font-semibold mb-2">Accepted Offers</span>
          {acceptedReceivedOffers.length > 0 ? (
            <table className="w-full bg-white border table-fixed">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Property</th>
                  <th className="py-2 px-4 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {acceptedReceivedOffers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="py-2 px-4 border-b">${offer.offer_amount.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{offer.Listing.property_address}</td>
                    <td className="py-2 px-4 border-b">{new Date(offer.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>-</p>
          )}
        </div>

        <div className="w-full">
          <span className="text-xl font-semibold mb-2">Rejected Offers</span>
          {rejectedReceivedOffers.length > 0 ? (
            <table className="w-full bg-white border table-fixed">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Property</th>
                  <th className="py-2 px-4 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {rejectedReceivedOffers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="py-2 px-4 border-b">${offer.offer_amount.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{offer.Listing.property_address}</td>
                    <td className="py-2 px-4 border-b">{new Date(offer.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>-</p>
          )}
        </div>
      </div>

      {/* Right side - Sent Offers */}
      <div className=" flex flex-col space-y-8">
        <h2 className="text-2xl font-bold">Offers Sent</h2>
        {sentOffers.length > 0 ? (
          <table className="w-full bg-white border table-fixed">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Property</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {sentOffers.map((offer) => (
                <tr key={offer.id}>
                  <td className="py-2 px-4 border-b">${offer.offer_amount.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{offer.Listing.property_address}</td>
                  <td className="py-2 px-4 border-b">{new Date(offer.created_at).toLocaleDateString()}</td>
                  <td className={`py-2 px-4 border-b font-semibold ${
                    offer.status === 'ACCEPTED' ? 'text-green-600' :
                    offer.status === 'REJECTED' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {offer.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You haven't sent any offers yet.</p>
        )}
      </div>
    </div>
  );
};

export default OffersView;