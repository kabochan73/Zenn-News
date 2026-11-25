"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFavoriteTopics } from "@/hooks/useFavoriteTopics";

export function HomeEntryRedirect() {
  const router = useRouter();
  const { favoriteTopics, isLoading } = useFavoriteTopics();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (favoriteTopics.length === 0) {
      router.replace("/topics?welcome=1");
    } else {
      router.replace(`/topics/${favoriteTopics[0]}`);
    }
  }, [isLoading, favoriteTopics, router]);

  return null;
}
