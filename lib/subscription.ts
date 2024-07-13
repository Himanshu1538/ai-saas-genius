import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

// Define the number of milliseconds in a day
const DAY_IN_MS = 86_400_00;

// Function to check if the user's subscription is valid
export const checkSubscription = async () => {
  // Get the authenticated user's ID
  const { userId } = auth();

  // If no user is authenticated, return false
  if (!userId) return false;

  // Find the user's subscription record in the database
  const userSubscription = await prismadb.userSubscription.findUnique({
    where: { userId },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  // If no subscription record exists, return false
  if (!userSubscription) return false;

  // Check if the subscription is valid based on the current period end date
  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();

  // Return true if the subscription is valid, otherwise false
  return !!isValid;
};
