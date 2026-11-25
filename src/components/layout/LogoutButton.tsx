"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    queryClient.clear();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="ログアウト"
      className="text-zinc-600"
    >
      <LogOut className="h-5 w-5" />
    </button>
  );
}
