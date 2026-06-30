"use client";

import Link from "next/link";
import { Logotype } from "@/app/components/logo/logotype";
import { useTranslations } from "next-intl";
import "./page.scss";

export default function LandingPage() {
    const t = useTranslations('landing');

    return (
        <div className="lp bg-color-primary text-color-primary">
            <main className="lp__main">
                <div className="lp__hero">
                    <h1 className="sr-only">TangledTo</h1>
                    <Logotype className="lp__logo" />
                    <p className="lp__tagline">{t('tagline')}</p>
                    <p className="lp__description">{t('description')}</p>
                    <Link href="/auth" className="lp__cta">
                        {t('cta')}
                    </Link>
                </div>
            </main>

            <footer className="lp__footer">
                <Link href="/privacy">{t('privacy')}</Link>
                <span>·</span>
                <Link href="/terms">{t('terms')}</Link>
            </footer>
        </div>
    );
}

