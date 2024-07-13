import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes which require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/forum(.*)",
  "/conversation(.*)",
  "/summary(.*)",
  "/code(.*)",
  "/settings(.*)",
]);

// Middleware function to protect the specified routes
export default clerkMiddleware((auth, req) => {
  // If the request matches a protected route, require authentication
  if (isProtectedRoute(req)) auth().protect();
});

// Export the configuration for the middleware
// This specifies which paths the middleware should apply to
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
