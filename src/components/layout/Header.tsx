import Link from "next/link";
import { LogoutButton } from "@/components/layout/LogoutButton";

type HeaderProps = {
  minimal?: boolean;
};

export function Header({ minimal = false }: HeaderProps) {
  return (
    <header className="border-b border-zinc-200">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold">
          Zenn News
        </Link>
        {!minimal && (
          <nav className="flex items-center gap-6 text-lg">
            <Link href="/" className="hidden lg:inline">
              HOME
            </Link>
            <Link href="/topics" className="hidden lg:inline">
              TOPICS
            </Link>
            <LogoutButton />
          </nav>
        )}
      </div>
    </header>
  );
}
