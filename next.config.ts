import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18/request.ts');

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
    additionalData: `@use "variables" as *; @use "mixins" as *;`,
  }
};

export default withNextIntl(nextConfig);
