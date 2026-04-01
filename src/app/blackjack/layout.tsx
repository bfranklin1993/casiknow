import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blackjack Strategy Trainer — Practice Basic Strategy",
  description:
    "Practice blackjack basic strategy with instant feedback. Adjusts for table rules: 3:2 vs 6:5, S17/H17, deck count, DAS, surrender.",
};

export default function BlackjackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
