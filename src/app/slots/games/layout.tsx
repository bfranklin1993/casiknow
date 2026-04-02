import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slot Machine RTP List — Best Slots to Play | CasiKnow",
  description:
    "Browse 30+ slot machines with real RTP ranges, volatility ratings, and pro tips. Find the best slot machines to play by RTP, manufacturer, and type.",
  keywords: [
    "best slot machines to play",
    "highest RTP slots",
    "slot machine RTP list",
    "slot machine odds",
    "Buffalo slot RTP",
    "Lightning Link RTP",
    "Double Diamond RTP",
  ],
};

export default function SlotGamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
