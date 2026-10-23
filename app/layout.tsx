import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXTAUTH_URL ??
      "http://localhost:3000"
  ),
  title: "Mayuresh Chaubal | GRC Analyst",
  description:
    "Mayuresh Chaubal is a GRC Analyst focused on information security governance, risk analysis, compliance readiness, and ISO/IEC 27001-aligned controls.",
  openGraph: {
    type: "website",
    title: "Mayuresh Chaubal | GRC Analyst",
    description:
      "Mayuresh Chaubal is a GRC Analyst focused on information security governance, risk analysis, compliance readiness, and ISO/IEC 27001-aligned controls.",
    images: [
      {
        url: "/hero-profile.png",
        width: 1155,
        height: 768,
        alt: "Mayuresh Chaubal - GRC Analyst portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mayuresh Chaubal | GRC Analyst",
    description:
      "Mayuresh Chaubal is a GRC Analyst focused on information security governance, risk analysis, compliance readiness, and ISO/IEC 27001-aligned controls.",
    images: ["/hero-profile.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
