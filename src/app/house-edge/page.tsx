import type { Metadata } from "next";
import HouseEdgeTable from "@/components/house-edge/HouseEdgeTable";

export const metadata: Metadata = {
  title: "House Edge Comparison — Every Casino Bet Ranked",
  description:
    "Compare house edge for every casino bet: blackjack, craps, roulette, baccarat, slots, video poker. See what each bet actually costs you per hour.",
};

export default function HouseEdgePage() {
  return <HouseEdgeTable />;
}
