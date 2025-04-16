import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook(.*)',
  '/cadastro/:schoolId',
  '/new-school',
  '/blog(.*)', // Blog público
]);

// Define a type for the expected publicMetadata structure in session claims
interface UserPublicMetadata {
  schoolId: string;
  schoolName: string;
  schoolSlug: string;
  schoolLogoUrl: string | null;
}

// Make the callback async to await auth()
export default clerkMiddleware(async (auth, req) => {
  console.log("Middleware intercepting:", req.nextUrl.pathname);
  // Allow public routes
  if (isPublicRoute(req)) {
    console.log("Route is public, allowing.");
    return NextResponse.next();
  }

  // Get auth state
  const { userId, sessionClaims } = await auth();

  // Redirect if not signed in
  if (!userId) {
    console.log("User not signed in, redirecting to sign-in.");
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Extract publicMetadata
  const publicMetadata = sessionClaims?.publicMetadata as UserPublicMetadata | undefined;

  const schoolId = publicMetadata?.schoolId;

  console.log("User is signed in, publicMetadata:", publicMetadata);

  // Redirect to new-school if needed
  if (!schoolId) {
    console.log("No schoolId found in publicMetadata:", publicMetadata)
    if (req.nextUrl.pathname === "/new-school" || req.nextUrl.pathname === "/api/update-clerk-metadata") {
      console.log("Allowing access to /new-school or /api/update-clerk-metadata.")
      return NextResponse.next()
    }
    console.log("Redirecting to /new-school.")
    const newSchoolUrl = new URL("/new-school", req.url)
    return NextResponse.redirect(newSchoolUrl)
  }
  // Allow access
  console.log("User is authenticated and has schoolId or is on allowed route, allowing access.");
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/api/update-clerk-metadata',
    '/((?!_next|static|favicon.ico|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};