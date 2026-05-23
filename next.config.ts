import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'i.scdn.co' },       // Spotify artist images
            { protocol: 'https', hostname: 'yt3.ggpht.com' },   // YouTube channel thumbnails
            { protocol: 'https', hostname: 'i.ytimg.com' },     // YouTube thumbnails
        ],
    },
};

export default withNextIntl(nextConfig);
