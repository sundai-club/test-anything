import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals
    "/((?!_next|api|trpc).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
