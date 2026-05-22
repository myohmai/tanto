"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./auth.scss";

type Mode = "login" | "signup";

export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            setError(err instanceof Error ? err.message : "エラーが発生しました");
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <div className="auth-page">
                <div className="auth-page__card">
                    <p className="auth-page__message">
                        確認メールを送りました。メールのリンクをクリックしてログインしてください。
                    </p>
                    <button className="auth-page__toggle" onClick={() => { setDone(false); setMode("login"); }}>
                        ログインへ戻る
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-page__card">
                <h1 className="auth-page__title">TanTo</h1>

                <form className="auth-page__form" onSubmit={handleSubmit}>
                    <input
                        className="auth-page__input"
                        type="email"
                        placeholder="メールアドレス"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <input
                        className="auth-page__input"
                        type="password"
                        placeholder="パスワード（6文字以上）"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                    />

                    {error && <p className="auth-page__error">{error}</p>}

                    <button
                        className="auth-page__submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "..." : mode === "login" ? "ログイン" : "アカウント作成"}
                    </button>
                </form>

                <button
                    className="auth-page__google"
                    type="button"
                    onClick={handleGoogleLogin}
                >
                    Googleでログイン
                </button>

                <button
                    className="auth-page__toggle"
                    onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                >
                    {mode === "login" ? "アカウントをお持ちでない方はこちら" : "ログインへ戻る"}
                </button>
            </div>
        </div>
    );
}
