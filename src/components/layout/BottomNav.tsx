"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/topics", label: "TOPICS" },
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
            className={`flex flex-1 items-center justify-center py-3 text-xs ${
              isActive ? "font-semibold" : "text-zinc-500"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
