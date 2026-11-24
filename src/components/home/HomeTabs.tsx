"use client";

import { Bookmark } from "lucide-react";
import type { ReactNode } from "react";

export type Tab = "new" | "read" | "bookmark";

type HomeTabsProps = {
  selected: Tab;
  onSelect: (tab: Tab) => void;
  counts: Record<Tab, number>;
};

const TABS: { key: Tab; label: ReactNode }[] = [
  { key: "new", label: "NEW" },
  { key: "read", label: "READ" },
  { key: "bookmark", label: <Bookmark className="h-4 w-4" /> },
];

export function HomeTabs({ selected, onSelect, counts }: HomeTabsProps) {
  return (
    <div className="flex border-b border-zinc-200">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onSelect(tab.key)}
          className={`flex flex-1 items-center justify-center gap-1 py-2 text-center text-sm ${
            selected === tab.key ? "bg-zinc-100 font-semibold" : "text-zinc-500"
          }`}
        >
          {tab.label} {counts[tab.key]}
        </button>
      ))}
    </div>
  );
}
