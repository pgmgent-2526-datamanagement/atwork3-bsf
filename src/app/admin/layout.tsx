"use client";

import Link from "next/link";
import { Film, Settings, BarChart3, Download, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./Dashboard.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.left}>
          <Film className={styles.logoIcon} />
          <h1>Admin Dashboard</h1>
        </div>

        <div className={styles.right}>
          <Button>
            <LogOut className="flex items-center gap-4" />
            Uitloggen
          </Button>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.nav}>
        <Link href="/admin/films" className={styles.navButton}>
          <Film size={18} /> Films Beheren
        </Link>

        <Link href="/admin/voting" className={styles.navButton}>
          <Settings size={18} /> Stemming Controle
        </Link>

        <Link href="/admin/results" className={styles.navButton}>
          <BarChart3 size={18} /> Resultaten
        </Link>

        <Link href="/admin/export" className={styles.navButton}>
          <Download size={18} /> Export
        </Link>
      </nav>

      {/* Page content */}
      <main className={styles.content}>{children}</main>
    </div>
  );
}
