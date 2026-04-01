import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Craps Strategy Guide — Learn Every Bet on the Table",
  description:
    "Interactive craps table guide. Tap any bet to learn the math. Get bankroll-based strategy recommendations. All odds are exact.",
};

export default function CrapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
