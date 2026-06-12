"use client";
import styles from "./logoutButton.module.css";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";

import { useToast } from "@/components/ui/Toast";

export function LogoutButton() {
  const router = useRouter();
  const toast = useToast();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Succesvol uitgelogd. Tot ziens!");
      router.push("/login");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message, "Fout bij uitloggen");
      }
    }
  }

    return (
      <Button className={styles.logoutButton} onClick={handleLogout}>
        <LogOut className="flex items-center gap-4" />
        Uitloggen
      </Button>
    );
}
