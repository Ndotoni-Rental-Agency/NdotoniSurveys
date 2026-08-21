import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Every route in this app is admin-only except /login and /not-authorized.
// The real ADMIN role check happens client-side in AuthGuard — this is a
// lightweight redirect based on the session marker cookie set by
// AuthContext, mirroring the main ndotoni-web app's middleware pattern.
// Note: the accessToken cookie is only ever set after the ADMIN check
// passes, so a non-admin never has it — /not-authorized must stay public
// or they'd get bounced straight back to /login.
const PUBLIC_ROUTES = ['/login', '/not-authorized', '/auth/callback'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
