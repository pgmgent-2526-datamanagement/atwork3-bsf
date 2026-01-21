import Link from "next/link";
import { Film, Settings, BarChart3, Download, QrCode } from "lucide-react";
import styles from "./Dashboard.module.css";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.left}>
          <Film className={styles.logoIcon} />
          <h1>Admin Dashboard</h1>
        </div>

        <div className={styles.right}>
          <LogoutButton />
        </div>
      </header>

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

        <Link href="/admin/qr" className={styles.navButton}>
          <QrCode size={18} /> Qr-code
        </Link>

        <Link href="/admin/export" className={styles.navButton}>
          <Download size={18} /> Export/Import
        </Link>

        <Link href="/admin/edition" className={styles.navButton}>
          <Download size={18} /> Reset
        </Link>
      </nav>

      {/* Page content */}
      <main className={styles.content}>{children}</main>
    </div>
  );
}
