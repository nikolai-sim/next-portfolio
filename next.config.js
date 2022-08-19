/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|glb)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=1, must-revalidate",
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};
