"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/momo",
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials.");
      setLoading(false);
      return;
    }

    window.location.href = result?.url ?? "/momo";
  };

  return (
    <main className="min-h-screen bg-background px-6 py-24 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Login</h1>
        <p className="mt-2 text-sm text-text-muted">
          Sign in to manage projects and contact data.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Admin email"
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Admin password"
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground"
          />

          {error && (
            <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
