"use server";
import { Resend } from "resend";
import { createClient } from "@/utils/supabase/server";
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY!);

type SendEmailResult = {
  success: boolean;
  error?: unknown;
};

export async function sendInviteEmail(email: string) {
  // Validate the email address
  if (!email || !validateEmail(email)) {
    throw new Error('A valid email address is required.');
  }

  // Initialize Supabase client with service role key (server-side only)
  const supabase = createClient(
  );

  // Invite the user by email
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: 'https://deerect.net/update-password', // Replace with your URL
  });

  if (error) {
    console.error('Error inviting user:', error);
    //throw new Error('Failed to send invitation email.');
    return [0, error]
  }

  // Optionally, return the data or a success message
  return [1,data];
}

export async function sendEmail(to: string, subject: string, text: string, isHtml: boolean = false) {
  try {
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
    
    const { data, error } = await resend.emails.send({
      from: 'no-reply@deerect.net',
      to,
      subject,
      ...(isHtml ? { html: text } : { text }),
    });

    if (error) {
      console.error('Resend API Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Specific email actions for each offer status
export async function sendOfferEmail(to: string, listingName: string): Promise<SendEmailResult> {
  const subject = `New Offer For ${listingName}`;
  const message = "Visit your dashboard to see your offer";
  return await sendEmail(to, subject, message);
}

export async function retractOfferEmail(to: string, listingName: string): Promise<SendEmailResult> {
  const subject = `Offer Retracted For ${listingName}`;
  const message = `Unfortunently, an offer for ${listingName} has been retracted`;
  return await sendEmail(to, subject, message);
}

export async function acceptOfferEmail(to: string, listingName: string): Promise<SendEmailResult> {
  const subject = "Accepted Offer";
  const message = `Your offer for ${listingName} has been accepted.`;
  return await sendEmail(to, subject, message);
}

export async function declineOfferEmail(to: string, listingName: string): Promise<SendEmailResult> {
  const subject = "Offer Declined";
  const message = `Your offer for ${listingName} has been declined.`;
  return await sendEmail(to, subject, message);
}

// Helper function to validate email addresses
function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
