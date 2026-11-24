import Link from "next/link";
import { LogoutButton } from "@/components/layout/LogoutButton";

type HeaderProps = {
  minimal?: boolean;
};

export function Header({ minimal = false }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
      <Link href="/" className="text-base font-bold">
        Zenn News
      </Link>
      {!minimal && (
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/topics" className="hidden lg:inline">
            TOPICS
          </Link>
          <LogoutButton />
        </nav>
      )}
    </header>
  );
}
