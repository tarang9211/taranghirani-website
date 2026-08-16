module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/index", destination: "/", permanent: true },
      { source: "/workshops", destination: "/destinations", permanent: true },
      {
        source: "/workshops/:path*",
        destination: "/destinations/:path*",
        permanent: true,
      },
    ];
  },
};
