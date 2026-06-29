"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import { SubmitButton } from "@/app/components/buttons/SubmitButton/SubmitButton";
import "./auth.scss";
import { Logotype } from "../components/logo/logotype";

type Mode = "login" | "signup";

export default function AuthPage() {
    const router = useRouter();
    const t = useTranslations('auth');
    const [mode, setMode] = useState<Mode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/feed`,
            },
        });
    };

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        try {
            if (mode === "login") {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push("/feed");
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setDone(true);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t('error'));
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <div className="auth-page bg-color-primary text-color-primary">
                <div className="auth-page__card">
                    <p className="auth-page__message">{t('confirmEmailSent')}</p>
                    <button className="auth-page__toggle" onClick={() => { setDone(false); setMode("login"); }}>
                        {t('backToLogin')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page bg-color-primary text-color-primary">
            <div className="auth-page__card">
                <div className="auth-page__title-container"><Logotype className="auth-page__title" /></div>


                <form className="auth-page__form" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <input
                        className="auth-page__input"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <input
                        className="auth-page__input"
                        type="password"
                        placeholder={t('passwordPlaceholder')}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                    />

                    {error && <p className="auth-page__error">{error}</p>}

                    {mode === 'signup' && (
                        <label className="auth-page__agree">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={e => setAgreed(e.target.checked)}
                            />
                            <span className="auth-page__agree-text">
                                {t('agreePrefix') ? <>{t('agreePrefix')}{' '}</> : null}
                                <Link href="/terms">{t('terms')}</Link>
                                {' '}{t('agreeMid')}{' '}
                                <Link href="/privacy">{t('privacy')}</Link>
                                {t('agreeSuffix')}
                            </span>
                        </label>
                    )}

                    <SubmitButton
                        label={loading ? "..." : mode === "login" ? t('login') : t('signup')}
                        onClick={handleSubmit}
                        disabled={loading || (mode === 'signup' && !agreed)}
                    />
                </form>

                <SubmitButton
                    label={t('googleLogin')}
                    onClick={handleGoogleLogin}
                />

                <button
                    className="auth-page__toggle"
                    onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setAgreed(false); }}
                >
                    {mode === "login" ? t('noAccount') : t('backToLogin')}
                </button>

                <div className="auth-page__footer">
                    <Link href="/privacy">{t('privacy')}</Link>
                    <span>·</span>
                    <Link href="/terms">{t('terms')}</Link>
                </div>
            </div>
        </div>
    );
}
