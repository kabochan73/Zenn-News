"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const READ_ARTICLES_QUERY_KEY = ["read-articles"];
const STALE_TIME_MS = 10 * 60 * 1000;
const GC_TIME_MS = 10 * 60 * 1000;

async function fetchReadArticleIds(): Promise<number[]> {
  const res = await fetch("/api/me/read-articles");
  if (!res.ok) {
    throw new Error("既読記事の取得に失敗しました");
  }
  const data = await res.json();
  return data.readArticleIds;
}

async function markArticleAsRead(articleId: number): Promise<void> {
  const res = await fetch("/api/me/read-articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ articleId }),
  });
  if (!res.ok) {
    throw new Error("既読にできませんでした");
  }
}

export function useReadArticles() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: READ_ARTICLES_QUERY_KEY,
    queryFn: fetchReadArticleIds,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
  });

  const mutation = useMutation({
    mutationFn: markArticleAsRead,
    onMutate: async (articleId) => {
      const previous =
        queryClient.getQueryData<number[]>(READ_ARTICLES_QUERY_KEY) ?? [];
      queryClient.setQueryData<number[]>(READ_ARTICLES_QUERY_KEY, (current) =>
        (current ?? []).includes(articleId)
          ? (current ?? [])
          : [...(current ?? []), articleId],
      );
      return { previous };
    },
    onError: (_error, _articleId, context) => {
      if (context) {
        queryClient.setQueryData(READ_ARTICLES_QUERY_KEY, context.previous);
      }
    },
  });

  return {
    readArticleIds: query.data ?? [],
    isLoading: query.isLoading,
    markAsRead: mutation.mutate,
  };
}
