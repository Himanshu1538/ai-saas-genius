import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

// URL to redirect users to after they manage their subscription
const settingsUrl = absoluteUrl("/settings");

export async function GET() {
  try {
    // Authenticate the user
    const { userId } = auth();
    const user = await currentUser();

    // If user is not authenticated, return unauthorized response
    if (!userId || !user)
      return new NextResponse("Unauthorized", { status: 401 });

    // Check if the user already has a subscription
    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    // If the user has a subscription, create a billing portal session
    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      // Return the billing portal session URL
      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    // If the user does not have a subscription, create a checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: "Genius Pro",
              description: "Unlimited AI Generations.",
            },
            unit_amount: 49900, // Amount in smallest currency unit
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    // Return the checkout session URL
    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    // Handle error
    // console.error("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
