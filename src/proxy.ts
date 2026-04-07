import { NextResponse } from 'next/server';
import { auth0 } from './lib/auth0';

// Rutas protegidas
const protectedRoutes = ['/profile', '/users/community'];

const PUBLIC_FILE = /\.(.*)$/;

export async function proxy(request: Request) {
  const { pathname } = new URL(request.url);

  // 🧹 1. Ignorar todo lo que NO debe pasar por el proxy
  if (
    pathname.startsWith('/_next') || // Next internals
    pathname.startsWith('/api') || // APIs
    pathname.startsWith('/auth') || // Auth routes (evita loops)
    pathname === '/favicon.ico' || // favicon
    PUBLIC_FILE.test(pathname) // cualquier archivo estático (.png, .svg, etc.)
  ) {
    return NextResponse.next();
  }

  // 🚀 2. Solo ejecutar lógica si es ruta protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  console.log(`🛡️ Protected route: ${pathname}`);

  try {
    const session = await auth0.getSession(request);

    // ❌ No autenticado → redirect login
    if (!session?.user) {
      console.log('❌ No session → redirect');

      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', request.url);

      return NextResponse.redirect(loginUrl);
    }

    // ✅ Usuario autenticado
    return NextResponse.next();
  } catch (error) {
    console.error('❌ Error verificando sesión:', error);

    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('returnTo', request.url);

    return NextResponse.redirect(loginUrl);
  }
}

// 🎯 Matcher simple y estable (recomendado)
export const config = {
  matcher: ['/:path*'],
};
