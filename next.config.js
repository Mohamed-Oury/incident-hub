/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/portfolio/projects/:id",
        destination: "/projets/:id",
        permanent: true,
      },
      {
        source: "/portfolio/projects",
        destination: "/projets",
        permanent: true,
      },
      {
        source: "/portfolio/blog/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/portfolio/blog",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
