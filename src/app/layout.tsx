import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | CasiKnow",
    default: "CasiKnow — Know the House. Beat the Odds.",
  },
  description:
    "Free casino strategy tools. House edge comparison, slot math optimizer, blackjack trainer, and craps guide — all backed by real math.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
