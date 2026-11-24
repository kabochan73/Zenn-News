"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const FAVORITE_TOPICS_QUERY_KEY = ["favorite-topics"];

async function fetchFavoriteTopics(): Promise<string[]> {
  const res = await fetch("/api/me/favorite-topics");
  if (!res.ok) {
    throw new Error("お気に入りトピックの取得に失敗しました");
  }
  const data = await res.json();
  return data.favoriteTopics;
}

async function saveFavoriteTopics(favoriteTopics: string[]): Promise<string[]> {
  const res = await fetch("/api/me/favorite-topics", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ favoriteTopics }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "保存に失敗しました");
  }

  const data = await res.json();
  return data.favoriteTopics;
}

export function useFavoriteTopics() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: FAVORITE_TOPICS_QUERY_KEY,
    queryFn: fetchFavoriteTopics,
  });

  const mutation = useMutation({
    mutationFn: saveFavoriteTopics,
    onSuccess: (favoriteTopics) => {
      queryClient.setQueryData(FAVORITE_TOPICS_QUERY_KEY, favoriteTopics);
    },
  });

  return {
    favoriteTopics: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    save: mutation.mutateAsync,
    isSaving: mutation.isPending,
    saveError: mutation.error,
  };
}
