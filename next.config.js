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
    return [{ source: "/index", destination: "/", permanent: true }];
  },
};
