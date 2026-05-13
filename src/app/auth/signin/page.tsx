"use client";

import { getCsrfToken } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function errorMessage(code: string | null) {
  if (!code) return null;
  const map: Record<string, string> = {
    OAuthSignin: "Could not start Google sign-in. Check Google OAuth credentials.",
    OAuthCallback:
      "Google could not finish signing you in. Your browser address must match NEXTAUTH_URL in .env (do not mix localhost and a LAN IP like 172.x). In Google Cloud → OAuth client → Authorized redirect URIs, add exactly: http(s)://YOUR_HOST:PORT/api/auth/callback/google. Try an incognito window or clear cookies for this site.",
    OAuthCreateAccount: "Could not create your account. Check the database connection.",
    OAuthAccountNotLinked:
      "This email is already linked to another sign-in method.",
    Callback:
      "Sign-in failed (often database unreachable or misconfigured). Check Neon is awake and DATABASE_URL.",
    Configuration: "Server auth is misconfigured (env vars or NEXTAUTH_URL).",
    AccessDenied: "Access was denied.",
    Default: "Sign-in failed. Please try again.",
  };
  return map[code] ?? map.Default;
}

function safeCallbackPath(from: string | null): string {
  if (!from || !from.startsWith("/") || from.startsWith("//")) {
    return "/dashboard";
  }
  try {
    const u = new URL(from, "http://local.invalid");
    if (u.origin !== "http://local.invalid") return "/dashboard";
  } catch {
    return "/dashboard";
  }
  return from;
}

function SignInInner() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const from = searchParams.get("from");
  /** Always a same-origin path — never a full URL — so OAuth matches NEXTAUTH_URL reliably. */
  const callbackUrl = safeCallbackPath(from);

  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void getCsrfToken()
      .then((t) => {
        if (!cancelled) {
          if (t) setCsrfToken(t);
          else
            setLoadError(
              "Could not load sign-in session. On Vercel: set NEXTAUTH_URL to this exact origin (https + host, no trailing slash), set NEXTAUTH_SECRET, and AUTH_TRUST_HOST=true, then redeploy. Visit /api/auth/csrf — you should see JSON including csrfToken.",
            );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError("Could not reach the auth server. Check NEXTAUTH_URL and that the app is running.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const oauthError = errorMessage(errorCode);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-sw-canvas px-4 py-10">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-sw-border bg-sw-surface p-8 shadow-xl sm:p-10">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-sw-ink-faint">
            Smart Wardrobe
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-sw-ink">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-sw-ink-muted">
            Sign in to curate looks and manage your closet.
          </p>
        </div>

        {(oauthError || loadError) && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {oauthError ?? loadError}
          </div>
        )}

        <div className="space-y-6">
          {!csrfToken ? (
            <p className="text-center text-sm text-sw-ink-muted">Preparing sign-in…</p>
          ) : (
            <form action="/api/auth/signin/google" method="POST">
              <input type="hidden" name="csrfToken" value={csrfToken} />
              <input type="hidden" name="callbackUrl" value={callbackUrl} />
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-xl border border-sw-border bg-sw-ink py-3.5 pl-4 pr-4 text-sm font-medium text-sw-surface transition hover:bg-sw-accent-hover focus:outline-none focus:ring-2 focus:ring-sw-accent-ring focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <FaGoogle className="h-5 w-5 text-sw-gold" aria-hidden />
                </span>
                Sign in with Google
              </button>
            </form>
          )}
        </div>

        {origin ? (
          <p className="text-center text-xs leading-relaxed text-sw-ink-faint">
            You are on{" "}
            <span className="rounded bg-sw-surface-muted px-1.5 py-0.5 font-mono text-sw-ink-muted">
              {origin}
            </span>
            .             Set <span className="font-mono">NEXTAUTH_URL</span> in <span className="font-mono">.env</span>{" "}
            to this same value (including <span className="font-mono">http</span> vs{" "}
            <span className="font-mono">https</span> and port). Do not use both{" "}
            <span className="font-mono">localhost</span> and <span className="font-mono">127.0.0.1</span>{" "}
            interchangeably. On Vercel, set <span className="font-mono">AUTH_TRUST_HOST=true</span> if redirects misbehave.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-sw-canvas px-4 py-10 text-sw-ink-muted">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-sw-border border-t-sw-accent" />
        </div>
      }
    >
      <SignInInner />
    </Suspense>
  );
}
