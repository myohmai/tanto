import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ResponsiveShell } from "@/app/shell";
import { ThemeInitializer } from "@/app/components/ThemeInitializer";

import 'destyle.css'
import './layout.scss';
import "@/app/styles/globals.scss";

export const metadata: Metadata = {
    title: "TangledTo",
    description: "Topic Based Social Media",
    openGraph: {
        title: "TangledTo",
        description: "Topic Based Social Media",
        url: "https://www.tangledto.com", 
        siteName: "tanto",
        images: [
            {
                url: "/images/202600620.png", 
                width: 1200,
                height: 630,
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "TangledTo",
        description: "Topic Based Social Media",
        images: ["/images/202600620.png"],
    },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <head>
                <GoogleAnalytics gaId="G-9TD67NV6FW" />
            </head>
            <body>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <ThemeInitializer />
                    <ResponsiveShell>
                        {children}
                    </ResponsiveShell>
                </NextIntlClientProvider>
            </body>
            
        </html>
    );
}
