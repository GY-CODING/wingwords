import { NextResponse } from 'next/server';
import { auth0 } from './lib/auth0';

// Rutas que requieren autenticación
const protectedRoutes = ['/profile', '/users/community'];

export async function proxy(request: Request) {
  const { pathname } = new URL(request.url);

  console.log(`🔗 Proxy: ${pathname}`);

  // Log de rutas Auth0 para debugging
  if (pathname.startsWith('/auth/')) {
    console.log(`🔐 Auth0 Route: ${pathname}`);
    console.log(`🔐 Full URL: ${request.url}`);
    return await auth0.middleware(request);
  }

  // Verificar si es una ruta protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    console.log(`🛡️ Protected route detected: ${pathname}`);

    try {
      const session = await auth0.getSession(request);
      console.log(`👤 Session:`, !!session?.user);

      if (!session?.user) {
        console.log(`❌ No session, redirecting to login`);
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('returnTo', request.url);
        return NextResponse.redirect(loginUrl);
      }

      console.log(`✅ User authenticated, allowing access`);
    } catch (error) {
      console.error('❌ Error verificando sesión:', error);
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Para todas las demás rutas, continuar con Auth0 middleware
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
