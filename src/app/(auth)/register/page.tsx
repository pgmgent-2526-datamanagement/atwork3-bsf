"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../SignUp.module.css";
import { authClient } from "@/services/authClient";
import { Button } from "@/components/ui/Button";

export default function SignUpPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await authClient.register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      router.push("/auth/sign-in");
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
      <h1 className={styles.title}>Create an account</h1>

      <form className={styles.form} onSubmit={handleRegister}>
        <input
          className={styles.input}
          type="text"
          placeholder="First name"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Last name"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

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

        <input
          className={styles.input}
          type="password"
          placeholder="Confirm Password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <Button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Registering..." : "Sign Up"}
        </Button>
      </form>

      <p className={styles.redirect}>
        Already have an account?{" "}
        <a href="/login" className={styles.link}>
          Sign in
        </a>
      </p>
    </div>
  );
}
