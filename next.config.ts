import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuramos next/image para cargar imágenes remotas desde WordPress
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pagos.saprix.com.co",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "pagos.saprix.com.co",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.pagos.saprix.com.co",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "www.pagos.saprix.com.co",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "trae-api-us.mchost.guru",
        port: "",
        pathname: "/api/**",
      },
    ],
  },


  async redirects() {
    return [
      {
        source: '/productos',
        destination: '/tienda',
        permanent: true,
      },
      {
        source: '/productos/page/:page',
        destination: '/tienda',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
