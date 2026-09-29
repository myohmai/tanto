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
    // 開発用: SUPABASE_DEV_PROXY_TARGET を設定した時だけ /supabase/* をローカルの Supabase に中継する。
    // ブラウザが別ポート(127.0.0.1:54321)への通信をブロックする環境で、同じオリジン経由で動作確認するため。
    // 例: SUPABASE_DEV_PROXY_TARGET=http://127.0.0.1:54321
    //     NEXT_PUBLIC_SUPABASE_URL=http://localhost:3000/supabase
    // 未設定(本番含む)では何もしない。
    async rewrites() {
        const target = process.env.SUPABASE_DEV_PROXY_TARGET;
        return target
            ? [{ source: '/supabase/:path*', destination: `${target}/:path*` }]
            : [];
    },
};

export default withNextIntl(nextConfig);
