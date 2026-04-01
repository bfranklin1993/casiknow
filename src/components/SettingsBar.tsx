"use client";

interface Setting {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "number" | "select";
  options?: string[];
}

interface SettingsBarProps {
  settings: Setting[];
}

export default function SettingsBar({ settings }: SettingsBarProps) {
  return (
    <div className="bg-ck-bg-secondary border-b border-ck-border-subtle px-7 py-3 flex gap-6 items-center flex-wrap">
      {settings.map((setting) => (
        <div key={setting.label} className="flex items-center gap-2">
          <span className="text-xs text-ck-text-muted tracking-[1px]">{setting.label}</span>
          {setting.type === "select" && setting.options ? (
            <select
              value={setting.value}
              onChange={(e) => setting.onChange(e.target.value)}
              className="bg-ck-border-subtle text-ck-accent text-sm px-2.5 py-0.5 appearance-none cursor-pointer"
            >
              {setting.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              value={setting.value}
              onChange={(e) => setting.onChange(e.target.value)}
              className="bg-ck-border-subtle text-ck-accent text-sm px-2.5 py-0.5 w-20 outline-none"
            />
          )}
        </div>
      ))}
    </div>
  );
}
