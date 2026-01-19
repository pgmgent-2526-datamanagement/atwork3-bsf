"use client";
import styles from "./logoutButton.module.css";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

    return (
      <Button className={styles.logoutButton} onClick={handleLogout}>
        <LogOut className="flex items-center gap-4" />
        Uitloggen
      </Button>
    );
}
