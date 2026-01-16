"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../SignUp.module.css";
import { authClient } from "@/services/authClient";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await authClient.login({ email, password });
      router.push("/admin");
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      }
    } finally {
      setLoading(false);
    }
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
          {loading ? "Signing in..." : "Log In"}
        </button>
      </form>

      <p className={styles.redirect}>
        Don&apos;t have an account?{" "}
        <a href="/register" className={styles.link}>
         Register
        </a>
      </p>
    </div>
  );
}
