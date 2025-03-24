import { NextRequest, NextResponse } from "next/server"; 
import Stripe from "stripe";

// Define price IDs for different plans
const PRICE_IDS = {
  pro: process.env.STRIPE_PRICE_ID || process.env.STRIPE_PRO_PRICE_ID,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID
};

// Log available environment variables (without revealing sensitive values)
console.log("Available price ID env vars:", {
  STRIPE_PRICE_ID: !!process.env.STRIPE_PRICE_ID,
  STRIPE_PRO_PRICE_ID: !!process.env.STRIPE_PRO_PRICE_ID,
  STRIPE_ENTERPRISE_PRICE_ID: !!process.env.STRIPE_ENTERPRISE_PRICE_ID
});

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe key exists
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("Missing Stripe secret key");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Parse the request body
    const body = await request.json();
    console.log("Received request body:", body);
    
    const { plan } = body as { plan: keyof typeof PRICE_IDS };
    console.log("Plan requested:", plan);
    
    // Get the corresponding price ID based on the plan
    const priceId = PRICE_IDS[plan];
    console.log("Price ID for plan:", priceId);
    
    if (!plan) {
      console.error("No plan specified in request");
      return NextResponse.json(
        { error: "No plan specified" },
        { status: 400 }
      );
    }
    
    if (!priceId) {
      console.error(`Missing price ID configuration for plan: ${plan}`);
      console.error(`Check your .env file - you need STRIPE_PRICE_ID or STRIPE_PRO_PRICE_ID set`);
      return NextResponse.json(
        { error: "Server configuration error for pricing" },
        { status: 500 }
      );
    }
    
    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?success=false`,
    });
    
    console.log("Checkout session created:", session.id);
    return NextResponse.json({ url: session.url });
    
  } catch (err) {
    console.error("Error in create-checkout-session:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}