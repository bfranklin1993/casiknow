"use client";

interface FilterPillsProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export default function FilterPills({ options, selected, onChange }: FilterPillsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`text-xs tracking-[1px] px-3 py-1.5 transition-colors ${
            selected === option
              ? "bg-ck-accent text-ck-bg font-bold"
              : "bg-ck-border-subtle text-ck-text-secondary hover:text-ck-text-primary"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
