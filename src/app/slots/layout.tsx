import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slot Math Optimizer — Best Way to Play Slots",
  description:
    "Enter your bankroll and goals to find the optimal slot denomination and bet size. RTP data from Nevada Gaming Control Board.",
};

export default function SlotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
