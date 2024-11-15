"use server";

import { createClient } from "@/utils/supabase/server";

// Helper function to initialize Supabase client
const supabase = createClient();

export async function send_offer(offerData: { listing_id: any; owner_id: any; buyer_id: any; offer_amount: any; status?: "pending" | undefined; }) {
  const { listing_id, owner_id, buyer_id, offer_amount, status = "pending" } = offerData;

  // Insert a new offer into the Offer table
  const { data, error } = await supabase
    .from("Offer")
    .insert({
      listing_id,
      owner_id,
      buyer_id,
      offer_amount,
      status,
      offer_date: new Date()
    });

  if (error) {
    throw new Error("Failed to send offer: " + error.message);
  }

  return data;
}

export async function retract_offer(offerId: any, buyerId: any) {
  // Update the offer status to "retracted" if the buyer is the one retracting it
  const { data, error } = await supabase
    .from("Offer")
    .update({ status: "retracted" })
    .eq("id", offerId)
    .eq("buyer_id", buyerId);

  if (error) {
    throw new Error("Failed to retract offer: " + error.message);
  }

  return data;
}

export async function accept_offer(offerId: any, ownerId: any) {
  // Update the offer status to "accepted" if the owner is accepting it
  const { data, error } = await supabase
    .from("Offer")
    .update({ status: "accepted", updated_at: new Date() })
    .eq("id", offerId)
    .eq("owner_id", ownerId);

  if (error) {
    throw new Error("Failed to accept offer: " + error.message);
  }

  return data;
}

export async function decline_offer(offerId: any, ownerId: any) {
  // Update the offer status to "declined" if the owner is declining it
  const { data, error } = await supabase
    .from("Offer")
    .update({ status: "declined", updated_at: new Date() })
    .eq("id", offerId)
    .eq("owner_id", ownerId);

  if (error) {
    throw new Error("Failed to decline offer: " + error.message);
  }

  return data;
}
