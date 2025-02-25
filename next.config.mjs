/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "alsxygutsqqgqjfjaerr.supabase.co",
      },
    ],
  },
};

export default nextConfig;
