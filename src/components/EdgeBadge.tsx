interface EdgeBadgeProps {
  edge: number;
  format?: "percent" | "raw";
}

export default function EdgeBadge({ edge, format = "percent" }: EdgeBadgeProps) {
  const pct = edge * 100;
  const color = pct <= 1.5 ? "text-ck-good" : pct <= 4 ? "text-ck-caution" : "text-ck-bad";
  const display = format === "percent" ? `${pct.toFixed(2)}%` : edge.toString();
  return <span className={`${color} font-bold`}>{display}</span>;
}
