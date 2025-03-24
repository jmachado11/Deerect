import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: { json: () => PromiseLike<{ priceId: any; }> | { priceId: any; }; }) {
  try {
    const { priceId } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId, // e.g. "price_12345"
          quantity: 1,
        },
      ],
      // Adjust success_url/cancel_url if you want a different route
      success_url: `https://deerect.net/?success=true`,
      cancel_url: `https://deerect.net/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
