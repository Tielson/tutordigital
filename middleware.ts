import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)', 
  '/api/webhook(.*)',
  '/cadastro/:schoolId',
  '/new-school',
  '/blog(.*)',
]);

interface UserPublicMetadata {
  schoolId: string;
  schoolName: string;
  schoolSlug: string;
  schoolLogoUrl: string | null;
}

export default clerkMiddleware(async (auth, req) => {
  

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Extract publicMetadata from session claims
  const publicMetadata = sessionClaims?.metadata as UserPublicMetadata | undefined;
  const schoolId = publicMetadata?.schoolId;

  if (req.nextUrl.pathname === "/new-school") {
    if (schoolId) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Then handle all other protected routes
  if (!schoolId) {
    return NextResponse.redirect(new URL("/new-school", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}