/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Portfolio redirects
      {
        source: "/a-propos",
        destination: "/portfolio/a-propos",
        permanent: true,
      },
      {
        source: "/projets/:id",
        destination: "/portfolio/projets/:id",
        permanent: true,
      },
      {
        source: "/projets",
        destination: "/portfolio/projets",
        permanent: true,
      },
      {
        source: "/projects/:id",
        destination: "/portfolio/projets/:id",
        permanent: true,
      },
      {
        source: "/projects",
        destination: "/portfolio/projets",
        permanent: true,
      },
      {
        source: "/portfolio/projects/:id",
        destination: "/portfolio/projets/:id",
        permanent: true,
      },
      {
        source: "/portfolio/projects",
        destination: "/portfolio/projets",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/portfolio/blog/:slug",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/portfolio/blog",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/portfolio/contact",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/",
        permanent: true,
      },

      // Monétique Hub redirects
      {
        source: "/diagnostic",
        destination: "/hub/diagnostic",
        permanent: true,
      },
      {
        source: "/atm-ej",
        destination: "/hub/atm-ej",
        permanent: true,
      },
      {
        source: "/emv",
        destination: "/hub/emv",
        permanent: true,
      },
      {
        source: "/bitmap",
        destination: "/hub/bitmap",
        permanent: true,
      },
      {
        source: "/parser",
        destination: "/hub/parser",
        permanent: true,
      },
      {
        source: "/de39",
        destination: "/hub/de39",
        permanent: true,
      },
      {
        source: "/mti",
        destination: "/hub/mti",
        permanent: true,
      },
      {
        source: "/crypto-hsm",
        destination: "/hub/crypto-hsm",
        permanent: true,
      },
      {
        source: "/knowledge",
        destination: "/hub/knowledge",
        permanent: true,
      },
      {
        source: "/post-mortem",
        destination: "/hub/post-mortem",
        permanent: true,
      },
      {
        source: "/run-supervision",
        destination: "/hub/run-supervision",
        permanent: true,
      },
      {
        source: "/timeout-matrix",
        destination: "/hub/timeout-matrix",
        permanent: true,
      },
      {
        source: "/audit",
        destination: "/hub/audit",
        permanent: true,
      },
      {
        source: "/training-monetique/:path*",
        destination: "/hub/training-monetique/:path*",
        permanent: true,
      },
      {
        source: "/training-monetique",
        destination: "/hub/training-monetique",
        permanent: true,
      },
      {
        source: "/incidents/:path*",
        destination: "/hub/incidents/:path*",
        permanent: true,
      },
      {
        source: "/incidents",
        destination: "/hub/knowledge",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
