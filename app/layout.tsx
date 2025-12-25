import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "UrLink",
  description: "A linktree style web app built with Next.js and Tailwind CSS.",
  icons: {
    icon: "/UrlinkLogo.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
