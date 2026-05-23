import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export type Locale = "en" | "ja" | "ko";
export const locales: Locale[] = ["en", "ja", "ko"];
export const defaultLocale: Locale = "ja";

export default getRequestConfig(async () => {
    const cookieStore = await cookies();
    const locale = (cookieStore.get("locale")?.value ?? defaultLocale) as Locale;
    const safeLocale = locales.includes(locale) ? locale : defaultLocale;

    return {
        locale: safeLocale,
        messages: (await import(`../../messages/${safeLocale}.json`)).default,
    };
});
