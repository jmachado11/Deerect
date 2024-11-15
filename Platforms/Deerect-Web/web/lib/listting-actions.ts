"use server";

import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

interface ListingData {
  owner_id: string;
  source?: string;
  title: string;
  description?: string;
  property_add?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  county?: string;
  property_type?: string;
  parcel_number?: string;
  assessed_value?: number;
  tax_amount?: number;
  redemption_d?: string;
  listing_date?: string;
  sale_price?: number;
  status?: string;
}

export async function addListing(listingData: ListingData): Promise<void> {
  const { error } = await supabase.from("Listings").insert({
    ...listingData,
    created_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
}

export async function deleteListing(listingId: string): Promise<void> {
  const { error } = await supabase.from("Listings").delete().eq("id", listingId);

  if (error) throw new Error(error.message);

  // Delete associated photos from the storage bucket
  await deleteListingPhotos(listingId);
}

export async function updateListing(listingId: string, updates: Partial<ListingData>): Promise<void> {
  const { error } = await supabase.from("Listings").update({
    ...updates,
    updated_at: new Date().toISOString(),
  }).eq("id", listingId);

  if (error) throw new Error(error.message);
}

// Helper functions for managing listing photos
const STORAGE_BUCKET_NAME = "listing-photos";

export async function addListingPhoto(listingId: string, file: File): Promise<string> {
    // Upload the file to the Supabase storage bucket
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .upload(`${listingId}/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });
  
    if (error) throw new Error("Failed to upload photo: " + error.message);
  
    // Generate the public URL for the uploaded file
    const publicUrlData = supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .getPublicUrl(`${listingId}/${file.name}`);
  
    if (!publicUrlData.data || !publicUrlData.data.publicUrl) {
      throw new Error("Failed to get public URL.");
    }
  
    return publicUrlData.data.publicUrl;
  }
  
  

export async function deleteListingPhoto(listingId: string, fileName: string): Promise<void> {
  const { error } = await supabase.storage.from(STORAGE_BUCKET_NAME).remove([`${listingId}/${fileName}`]);

  if (error) throw new Error("Failed to delete photo: " + error.message);
}

export async function deleteListingPhotos(listingId: string): Promise<void> {
  // List all files in the listing's folder and delete them
  const { data: files, error } = await supabase.storage
    .from(STORAGE_BUCKET_NAME)
    .list(listingId);

  if (error) throw new Error("Failed to list photos: " + error.message);

  if (files && files.length > 0) {
    const filePaths = files.map((file) => `${listingId}/${file.name}`);
    const { error: deleteError } = await supabase.storage.from(STORAGE_BUCKET_NAME).remove(filePaths);

    if (deleteError) throw new Error("Failed to delete photos: " + deleteError.message);
  }
}

export async function updateListingPhoto(listingId: string, oldFileName: string, newFile: File): Promise<string> {
  // Delete the old photo
  await deleteListingPhoto(listingId, oldFileName);

  // Upload the new photo
  return await addListingPhoto(listingId, newFile);
}
