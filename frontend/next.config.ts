

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'reality-check-1.onrender.com'
      },
    ],
  },
};


export default nextConfig;
