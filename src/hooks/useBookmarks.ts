"use client";

import { useQuery } from "@tanstack/react-query";
import type { Bookmark } from "@/types/article";

const BOOKMARKS_QUERY_KEY = ["bookmarks"];

async function fetchBookmarks(): Promise<Bookmark[]> {
  const res = await fetch("/api/me/bookmarks");
  if (!res.ok) {
    throw new Error("ブックマークの取得に失敗しました");
  }
  const data = await res.json();
  return data.bookmarks;
}

export function useBookmarks() {
  const query = useQuery({
    queryKey: BOOKMARKS_QUERY_KEY,
    queryFn: fetchBookmarks,
  });

  return {
    bookmarks: query.data ?? [],
    isLoading: query.isLoading,
  };
}
