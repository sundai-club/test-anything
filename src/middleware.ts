import { clerkMiddleware } from "@clerk/nextjs/server";

// Use the standard Clerk middleware with no custom options
export default clerkMiddleware();

// Stop Middleware running on static files and optimize the matcher pattern
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
