/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    useDeploymentId: true,
  },
};

module.exports = nextConfig;
