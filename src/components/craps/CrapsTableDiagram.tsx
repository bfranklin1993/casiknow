"use client";

import { CRAPS_BETS, type CrapsBet } from "@/data/craps-bets";

interface CrapsTableDiagramProps {
  selectedBetId: string | null;
  onSelectBet: (id: string) => void;
}

function edgeColor(edge: number): string {
  if (edge === 0) return "#4ade80";
  if (edge <= 0.015) return "#4ade80";
  if (edge <= 0.04) return "#eab308";
  return "#ef4444";
}

interface BetZone {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  edge: number;
}

const ZONES: BetZone[] = [
  { id: "dont-pass", label: "DON'T PASS", sublabel: "BAR ⚅⚅", x: 10, y: 10, w: 280, h: 50, edge: 0.0106 },
  { id: "dont-come", label: "DON'T COME", sublabel: "", x: 300, y: 10, w: 280, h: 50, edge: 0.0106 },
  // Number boxes
  { id: "place-4", label: "4", sublabel: "9:5", x: 10, y: 70, w: 90, h: 60, edge: 0.0667 },
  { id: "place-5", label: "5", sublabel: "7:5", x: 105, y: 70, w: 90, h: 60, edge: 0.04 },
  { id: "place-6", label: "6", sublabel: "7:6", x: 200, y: 70, w: 90, h: 60, edge: 0.0152 },
  { id: "place-6", label: "8", sublabel: "7:6", x: 295, y: 70, w: 90, h: 60, edge: 0.0152 },
  { id: "place-5", label: "9", sublabel: "7:5", x: 390, y: 70, w: 90, h: 60, edge: 0.04 },
  { id: "place-4", label: "10", sublabel: "9:5", x: 485, y: 70, w: 90, h: 60, edge: 0.0667 },
  // Come
  { id: "come", label: "COME", sublabel: "", x: 10, y: 140, w: 380, h: 50, edge: 0.0141 },
  // Field
  { id: "field-3x", label: "FIELD", sublabel: "2,3,4,9,10,11,12", x: 400, y: 140, w: 180, h: 50, edge: 0.0278 },
  // Pass Line
  { id: "pass", label: "PASS LINE", sublabel: "", x: 10, y: 200, w: 570, h: 55, edge: 0.0141 },
  // Props
  { id: "hard-6-8", label: "HARD 6/8", sublabel: "9.09%", x: 10, y: 268, w: 138, h: 40, edge: 0.0909 },
  { id: "hard-4-10", label: "HARD 4/10", sublabel: "11.11%", x: 153, y: 268, w: 138, h: 40, edge: 0.1111 },
  { id: "any-7", label: "ANY 7", sublabel: "16.67%", x: 296, y: 268, w: 138, h: 40, edge: 0.1667 },
  { id: "any-craps", label: "ANY CRAPS", sublabel: "11.11%", x: 439, y: 268, w: 141, h: 40, edge: 0.1111 },
];

export default function CrapsTableDiagram({
  selectedBetId,
  onSelectBet,
}: CrapsTableDiagramProps) {
  return (
    <div className="bg-ck-felt p-6">
      <svg
        viewBox="0 0 590 320"
        className="w-full max-w-2xl mx-auto"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        {/* Table border */}
        <rect
          x="2"
          y="2"
          width="586"
          height="316"
          rx="8"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />
        <rect
          x="6"
          y="6"
          width="578"
          height="308"
          rx="6"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />

        {/* Bet zones */}
        {ZONES.map((zone, i) => {
          const isSelected = selectedBetId === zone.id;
          const color = edgeColor(zone.edge);
          return (
            <g
              key={`${zone.id}-${i}`}
              onClick={() => onSelectBet(zone.id)}
              className="cursor-pointer"
            >
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.w}
                height={zone.h}
                fill={
                  zone.edge > 0.08
                    ? "rgba(239,68,68,0.12)"
                    : zone.id === "pass"
                      ? "rgba(245,197,66,0.12)"
                      : "rgba(255,255,255,0.06)"
                }
                stroke={
                  isSelected
                    ? "#f5c542"
                    : zone.id === "pass"
                      ? "rgba(245,197,66,0.3)"
                      : zone.edge > 0.08
                        ? "rgba(239,68,68,0.3)"
                        : "rgba(255,255,255,0.15)"
                }
                strokeWidth={isSelected ? 2 : 1}
                rx="2"
              />
              <text
                x={zone.x + zone.w / 2}
                y={zone.y + (zone.sublabel ? zone.h / 2 - 4 : zone.h / 2 + 1)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={zone.id === "pass" ? "#f5c542" : "#fff"}
                fontSize={zone.h > 50 ? 13 : 11}
                fontWeight="bold"
                letterSpacing="1"
              >
                {zone.label}
              </text>
              {zone.sublabel && (
                <text
                  x={zone.x + zone.w / 2}
                  y={zone.y + zone.h / 2 + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.4)"
                  fontSize={8}
                >
                  {zone.sublabel}
                </text>
              )}
              {/* Edge label */}
              <text
                x={zone.x + zone.w - 6}
                y={zone.y + 12}
                textAnchor="end"
                fill={color}
                fontSize={8}
              >
                {(zone.edge * 100).toFixed(2)}%
              </text>
            </g>
          );
        })}
      </svg>
      <div className="text-[10px] text-white/30 text-center mt-3">
        TAP ANY BET TO LEARN MORE
      </div>
    </div>
  );
}
