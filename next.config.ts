import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18/request.ts');

const nextConfig: NextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
    additionalData: `@use "variables" as *; @use "mixins" as *;`,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'phpstack-1497927-5868931.cloudwaysapps.com',
      },
      {
        protocol: 'https',
        hostname: 'photos.hotelbeds.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
