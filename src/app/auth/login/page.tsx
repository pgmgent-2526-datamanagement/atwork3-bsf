"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../SignUp.module.css";
export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    console.log("LOGIN SUBMITTED");
    setLoading(true);
    setErrorMsg("");
    console.log("Before fetch");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log("After fetch", res);
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setErrorMsg(data.error || "Login failed");
      return;
    }

    // Login success → redirect
    router.push("/admin");
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign In</h1>

      <form className={styles.form} onSubmit={handleLogin}>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className={styles.redirect}>
        Don&apos;t have an account?{" "}
        <a href="/auth/sign-up" className={styles.link}>
          Sign up
        </a>
      </p>
    </div>
  );
}
