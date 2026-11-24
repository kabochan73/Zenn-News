"use client";

import { useQuery } from "@tanstack/react-query";

const READ_ARTICLES_QUERY_KEY = ["read-articles"];

async function fetchReadArticleIds(): Promise<number[]> {
  const res = await fetch("/api/me/read-articles");
  if (!res.ok) {
    throw new Error("既読記事の取得に失敗しました");
  }
  const data = await res.json();
  return data.readArticleIds;
}

export function useReadArticles() {
  const query = useQuery({
    queryKey: READ_ARTICLES_QUERY_KEY,
    queryFn: fetchReadArticleIds,
  });

  return {
    readArticleIds: query.data ?? [],
    isLoading: query.isLoading,
  };
}
