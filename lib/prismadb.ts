import { PrismaClient } from "@prisma/client";

// Declare a global variable for the Prisma client instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize the Prisma client, using the global instance if it exists
const prismadb = globalThis.prisma || new PrismaClient();

// In non-production environments, assign the Prisma client to the global variable
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;
