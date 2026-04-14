import { NextResponse } from 'next/server';
import { auth0 } from './lib/auth0';
import { logger } from '@/utils/logger';

// Rutas que requieren autenticación
const protectedRoutes = ['/profile', '/users/community'];

export async function middleware(request: Request) {
  const { pathname } = new URL(request.url);

  // Filtrar logs de archivos estáticos y rutas innecesarias
  const staticPatterns = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.css',
    '.js',
    '.woff',
    '.woff2',
    '.ttf',
    '.map',
  ];
  const isStatic = staticPatterns.some((ext) => pathname.endsWith(ext));
  const isPublicAPI = pathname.startsWith('/api/public');
  const isAuthGet = pathname === '/api/auth/get';

  if (!isStatic && !isPublicAPI && !isAuthGet) {
    logger.debug('Proxy', { pathname });
  }

  // Log de rutas Auth0 para debugging
  if (pathname.startsWith('/auth/')) {
    logger.debug('Auth0 Route', { pathname });
    return await auth0.middleware(request);
  }

  // Verificar si es una ruta protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    logger.debug('Protected route detected', { pathname });
    try {
      const session = await auth0.getSession(request);
      if (!session?.user) {
        logger.warn('No session, redirecting to login', { pathname });
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('returnTo', request.url);
        return NextResponse.redirect(loginUrl);
      }
      logger.debug('User authenticated', {
        pathname,
        userId: session.user?.sub,
      });
    } catch (error) {
      logger.error('Session verification error', { pathname }, error);
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
