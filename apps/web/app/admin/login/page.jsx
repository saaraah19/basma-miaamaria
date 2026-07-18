"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "@/lib/auth-client";
import "./login.css";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ email, password });
      const redirectTo = searchParams.get("from") || "/admin";
      router.push(redirectTo);
    } catch {
      // error state is derived from login.isError below — nothing to do here
    }
  };

  const errorMessage =
    login.error?.response?.data?.error ?? "Email ou mot de passe incorrect.";

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Panel Admin</h1>
          <div className="login-divider" />
        </div>

        {login.isError && <div className="login-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="admin@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={login.isPending}>
            {login.isPending ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  // useSearchParams requires a Suspense boundary in the App Router
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
