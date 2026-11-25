"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Bookmark } from "@/types/article";

const BOOKMARKS_QUERY_KEY = ["bookmarks"];
const STALE_TIME_MS = 10 * 60 * 1000;
const GC_TIME_MS = 10 * 60 * 1000;

type NewBookmark = {
  articleId: number;
  path: string;
  title: string;
  authorName: string;
  authorAvatarUrl: string | null;
  publishedAt: string;
};

async function fetchBookmarks(): Promise<Bookmark[]> {
  const res = await fetch("/api/me/bookmarks");
  if (!res.ok) {
    throw new Error("ブックマークの取得に失敗しました");
  }
  const data = await res.json();
  return data.bookmarks;
}

async function addBookmark(input: NewBookmark): Promise<Bookmark | null> {
  const res = await fetch("/api/me/bookmarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "ブックマークに失敗しました");
  }

  const data = await res.json();
  return data.bookmark ?? null;
}

async function removeBookmark(articleId: number): Promise<void> {
  const res = await fetch("/api/me/bookmarks", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ articleId }),
  });

  if (!res.ok) {
    throw new Error("ブックマークの解除に失敗しました");
  }
}

export function useBookmarks() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: BOOKMARKS_QUERY_KEY,
    queryFn: fetchBookmarks,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
  });

  const addMutation = useMutation({
    mutationFn: addBookmark,
    onSuccess: (bookmark) => {
      if (!bookmark) {
        return;
      }
      queryClient.setQueryData<Bookmark[]>(BOOKMARKS_QUERY_KEY, (current) => {
        const list = current ?? [];
        if (list.some((item) => item.articleId === bookmark.articleId)) {
          return list;
        }
        return [bookmark, ...list];
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeBookmark,
    onSuccess: (_data, articleId) => {
      queryClient.setQueryData<Bookmark[]>(BOOKMARKS_QUERY_KEY, (current) =>
        (current ?? []).filter((item) => item.articleId !== articleId),
      );
    },
  });

  return {
    bookmarks: query.data ?? [],
    isLoading: query.isLoading,
    addBookmark: addMutation.mutateAsync,
    removeBookmark: removeMutation.mutateAsync,
  };
}
