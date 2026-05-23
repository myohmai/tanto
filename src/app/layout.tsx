import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ResponsiveShell } from "@/app/shell";
import { ThemeInitializer } from "@/app/components/ThemeInitializer";

import 'destyle.css'
import './layout.scss';
import "@/app/styles/globals.scss";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <ThemeInitializer />
                    <ResponsiveShell>
                        {children}
                    </ResponsiveShell>
                </NextIntlClientProvider>
            </body>
            <GoogleAnalytics gaId="G-9TD67NV6FW" />
        </html>
    );
}
