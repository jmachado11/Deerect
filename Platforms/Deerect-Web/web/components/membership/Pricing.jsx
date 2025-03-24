"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Pricing() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Next.js App Router: useSearchParams to read "?success=true" or "?canceled=true"
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  // 1. On mount, load the current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getCurrentUser();
  }, [supabase]);

  // 2. If the user is redirected back from Stripe with ?success=true,
  //    update their subscription in Supabase.
  useEffect(() => {
    const updateSubscription = async () => {
      try {
        if (success === "true") {
          // Ensure we have a user
          if (!user) return;

          // This adds or updates a 'subscription' field in user metadata
          const { error } = await supabase.auth.updateUser({
            data: { subscription: "pro" },
          });
          if (error) {
            console.error("Error updating subscription:", error);
          } else {
            console.log("User subscription updated to 'pro'!");
          }
        }
      } catch (err) {
        console.error("Unexpected error updating subscription:", err);
      }
    };

    updateSubscription();
    // Only run once user is loaded + we know if success param is present
  }, [success, user, supabase]);

  // 3. Handle Stripe checkout for the Pro plan
  const handleProCheckout = async () => {
    if (!user) {
      alert("You must be logged in to purchase a subscription.");
      return;
    }

    try {
      setIsLoading(true);

      // Call our API endpoint to create a Checkout Session
      // Using a hard-coded plan reference – the actual ID is stored securely on the server
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert(`Checkout error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Get user's subscription status
  const userSubscription = user?.user_metadata?.subscription || "free";

  const pricingContent = [
    {
      id: 1,
      title: "Standard - Free",
      features: [
        "Unlimited Tax Lien Listings",
        "Unlimited Tax Lien Purchases",
        "24/7 Customer Support",
      ],
      isCurrentPlan: userSubscription === "free",
      buttonText: userSubscription === "free" ? "Current Plan" : "Downgrade",
      buttonDisabled: userSubscription === "free",
    },
    {
      id: 2,
      title: "Pro",
      // Updated price to $99.99 as requested
      price: "$99.99",
      features: ["Everything in Free", "Data Insights", "Financing"],
      isCurrentPlan: userSubscription === "pro",
      buttonText: userSubscription === "pro" ? "Current Plan" : "Upgrade to Pro",
      buttonAction: handleProCheckout,
      buttonDisabled: isLoading,
    },
    {
      id: 3,
      title: "Enterprise",
      features: ["Unlimited API Access", "Access To Beta Features", "Dedicated Customer Support"],
      isCurrentPlan: false,
      buttonText: "Contact Us",
      buttonLink: "/contact",
    },
  ];

  // Preserve the logic & data, but apply the old component's structure and classes
  return (
    <div className="container">
      <div className="row">
        {pricingContent.map((plan) => (
          <div className="col-sm-6 col-md-6 col-lg-4" key={plan.id}>
            <div className="pricing_table">
              <div className="pricing_header">
                {/* Show plan title and price if applicable */}
                <div className="price">
                  {plan.title}
                  {plan.price && <span> – {plan.price}</span>}
                </div>
              </div>

              <div className="pricing_content">
                <h4>Details</h4>
                <ul className="mb0">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="pricing_footer">
                {/* Button/Link logic from the new component */}
                {plan.buttonAction ? (
                  <button
                    disabled={plan.buttonDisabled || isLoading}
                    onClick={!plan.isCurrentPlan ? plan.buttonAction : undefined}
                    className={
                      plan.isCurrentPlan
                        ? "pricing_btn btn-block"
                        : "btn pricing_btn btn-block"
                    }
                  >
                    {isLoading && plan.id === 2 && !plan.isCurrentPlan
                      ? "Loading..."
                      : plan.buttonText}
                  </button>
                ) : plan.buttonLink ? (
                  <a
                    href={plan.buttonLink}
                    className="btn pricing_btn btn-block"
                  >
                    {plan.buttonText}
                  </a>
                ) : (
                  <button disabled className="pricing_btn btn-block">
                    {plan.buttonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
