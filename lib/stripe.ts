import Stripe from "stripe";

// Initialize the Stripe client using the Stipe API key
export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2024-04-10", // Specify the API version
  typescript: true, // Enable TypeScript support
});
