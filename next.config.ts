import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16: serverComponentsExternalPackages moved out of experimental
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg', 'bcryptjs'],
  
  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  turbopack: {
    // Turbopack handles Node.js module exclusion automatically
  },
};

export default nextConfig;
