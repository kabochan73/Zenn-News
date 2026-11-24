"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "HOME", icon: "🏠" },
  { href: "/topics", label: "TOPICS", icon: "🏷" },
  { href: "/bookmarks", label: "BOOKMARK", icon: "🔖" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-zinc-200 bg-white lg:hidden">
      {ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname.startsWith("/topics/")
            : pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
              isActive ? "font-semibold" : "text-zinc-500"
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
