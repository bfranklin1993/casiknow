"use client";

import { useState } from "react";

interface ExpandableRowProps {
  title: string;
  children: React.ReactNode;
}

export default function ExpandableRow({ title, children }: ExpandableRowProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-l-[3px] ${open ? "border-ck-accent bg-ck-bg-tertiary" : "border-transparent"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-3 text-xs text-ck-accent tracking-[1px] hover:bg-ck-bg-tertiary transition-colors"
      >
        {open ? "▼" : "▶"} {title}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-ck-text-secondary leading-relaxed">{children}</div>
      )}
    </div>
  );
}
