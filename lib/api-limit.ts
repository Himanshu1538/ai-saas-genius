import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNT } from "@/constants";

// Function to increase the API limit count
export const increaseApiLimit = async () => {
  // Get the authenticated user's ID
  const { userId } = auth();

  // If no user is authenticated, return
  if (!userId) return;

  // Find the user's API limit record in the database
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId },
  });

  if (userApiLimit) {
    // If the record exists, increment the API call count
    await prismadb.userApiLimit.update({
      where: { userId },
      data: { count: userApiLimit.count + 1 },
    });
  } else {
    // If the record does not exist, create a new one with a count of 1
    await prismadb.userApiLimit.create({
      data: {
        userId,
        count: 1,
      },
    });
  }
};

// Function to check if the user is within their API limit
export const checkApiLimit = async () => {
  // Get the authenticated user's ID
  const { userId } = auth();

  // If no user is authenticated, return false
  if (!userId) return false;

  // Find the user's API limit record in the database
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId },
  });

  // Check if the user is within the maximum free API call count
  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNT) {
    return true;
  } else {
    return false;
  }
};

// Function to get the current API limit count
export const getApiLimitCount = async () => {
  // Get the authenticated user's ID
  const { userId } = auth();

  // If no user is authenticated, return 0
  if (!userId) return 0;

  // Find the user's API limit record in the database
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId },
  });

  // If no record exists, return 0
  if (!userApiLimit) return 0;

  // Return the current API call count
  return userApiLimit.count;
};
