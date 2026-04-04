/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuración de source maps deshabilitada para producción
  productionBrowserSourceMaps: false,
  // External packages para evitar problemas con MongoDB en servidor
  serverExternalPackages: ['mongodb'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Optimizaciones para producción
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
