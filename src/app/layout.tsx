import { Forum } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const forum = Forum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-forum",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${forum.variable} antialiased`}>
        <ToastProvider>
          <main>{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
