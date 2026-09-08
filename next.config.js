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
      // The Jan 2027 departure merged into the single Panna page; keep old
      // links working (before the wildcard so /workshops/panna-jan is one hop).
      {
        source: "/workshops/panna-jan",
        destination: "/destinations/panna",
        permanent: true,
      },
      {
        source: "/destinations/panna-jan",
        destination: "/destinations/panna",
        permanent: true,
      },
      {
        source: "/workshops/:path*",
        destination: "/destinations/:path*",
        permanent: true,
      },
    ];
  },
};
