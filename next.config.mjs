/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-dialog",
      "date-fns"
    ],
  },

  images: {
    minimumCacheTTL: 60 * 60 * 24 * 30,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;