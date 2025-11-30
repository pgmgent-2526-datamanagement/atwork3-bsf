import { Forum } from "next/font/google";
import "./globals.css";

const forum = Forum({
  weight: "400", // Forum heeft maar één gewicht
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
      <body
        className={`${forum.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
