"use client";

import { CRAPS_BETS, type CrapsBet } from "@/data/craps-bets";

interface CrapsTableDiagramProps {
  selectedBetId: string | null;
  onSelectBet: (id: string) => void;
}

function zoneFill(edge: number, isPass: boolean): string {
  if (isPass) return "rgba(74,222,128,0.22)";
  if (edge <= 0.015) return "rgba(74,222,128,0.18)";
  if (edge <= 0.04) return "rgba(234,179,8,0.18)";
  return "rgba(239,68,68,0.22)";
}

function zoneStroke(edge: number, isPass: boolean, isSelected: boolean): string {
  if (isSelected) return "#f5c542";
  if (isPass) return "rgba(74,222,128,0.7)";
  if (edge <= 0.015) return "rgba(74,222,128,0.5)";
  if (edge <= 0.04) return "rgba(234,179,8,0.5)";
  return "rgba(239,68,68,0.6)";
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
  { id: "dont-come", label: "DON'T COME", x: 300, y: 10, w: 280, h: 50, edge: 0.0106 },
  // Number boxes
  { id: "place-4", label: "4", x: 10, y: 70, w: 90, h: 60, edge: 0.0667 },
  { id: "place-5", label: "5", x: 105, y: 70, w: 90, h: 60, edge: 0.04 },
  { id: "place-6", label: "6", x: 200, y: 70, w: 90, h: 60, edge: 0.0152 },
  { id: "place-6", label: "8", x: 295, y: 70, w: 90, h: 60, edge: 0.0152 },
  { id: "place-5", label: "9", x: 390, y: 70, w: 90, h: 60, edge: 0.04 },
  { id: "place-4", label: "10", x: 485, y: 70, w: 90, h: 60, edge: 0.0667 },
  // Come
  { id: "come", label: "COME", x: 10, y: 140, w: 380, h: 50, edge: 0.0141 },
  // Field
  { id: "field-3x", label: "FIELD", sublabel: "2,3,4,9,10,11,12", x: 400, y: 140, w: 180, h: 50, edge: 0.0278 },
  // Pass Line
  { id: "pass", label: "PASS LINE", x: 10, y: 200, w: 570, h: 55, edge: 0.0141 },
  // Props
  { id: "hard-6-8", label: "HARD 6/8", x: 10, y: 268, w: 138, h: 40, edge: 0.0909 },
  { id: "hard-4-10", label: "HARD 4/10", x: 153, y: 268, w: 138, h: 40, edge: 0.1111 },
  { id: "any-7", label: "ANY 7", x: 296, y: 268, w: 138, h: 40, edge: 0.1667 },
  { id: "any-craps", label: "ANY CRAPS", x: 439, y: 268, w: 141, h: 40, edge: 0.1111 },
];

export default function CrapsTableDiagram({
  selectedBetId,
  onSelectBet,
}: CrapsTableDiagramProps) {
  return (
    <div className="bg-ck-felt px-6 pt-5 pb-4">
      {/* Intro text */}
      <p className="text-xs text-white/60 text-center mb-4 tracking-wide">
        Tap any area on the table to learn what it is and whether it&apos;s a smart bet.
      </p>

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
          const isPass = zone.id === "pass";
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
                fill={zoneFill(zone.edge, isPass)}
                stroke={zoneStroke(zone.edge, isPass, isSelected)}
                strokeWidth={isSelected ? 2.5 : isPass ? 1.5 : 1}
                rx="2"
              />
              <text
                x={zone.x + zone.w / 2}
                y={zone.y + (zone.sublabel ? zone.h / 2 - 5 : zone.h / 2 + 1)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize={zone.h > 50 ? 14 : 12}
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
                  fill="rgba(255,255,255,0.45)"
                  fontSize={8.5}
                >
                  {zone.sublabel}
                </text>
              )}
              {/* START HERE indicator on PASS LINE */}
              {isPass && (
                <>
                  <rect
                    x={zone.x + zone.w - 110}
                    y={zone.y + 10}
                    width={100}
                    height={22}
                    rx="3"
                    fill="rgba(74,222,128,0.25)"
                    stroke="rgba(74,222,128,0.7)"
                    strokeWidth="1"
                  />
                  <text
                    x={zone.x + zone.w - 60}
                    y={zone.y + 21}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#4ade80"
                    fontSize={9}
                    fontWeight="bold"
                    letterSpacing="1"
                  >
                    ★ START HERE
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 flex-wrap">
        <span className="text-xs text-white/70 flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-green-400/60 border border-green-400/80" />
          GOOD BET
        </span>
        <span className="text-xs text-white/70 flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-yellow-400/50 border border-yellow-400/70" />
          OK
        </span>
        <span className="text-xs text-white/70 flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-red-500/60 border border-red-500/80" />
          SUCKER BET
        </span>
      </div>
    </div>
  );
}
