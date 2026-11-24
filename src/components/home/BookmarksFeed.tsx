"use client";

import { useState } from "react";
import { ArticleCard } from "@/components/home/ArticleCard";
import { Toast } from "@/components/ui/Toast";
import { useBookmarks } from "@/hooks/useBookmarks";
import type { Article } from "@/types/article";

export function BookmarksFeed() {
  const { bookmarks, isLoading, removeBookmark } = useBookmarks();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  async function handleRemove(articleId: number) {
    try {
      await removeBookmark(articleId);
    } catch (error) {
      setToastMessage(
        error instanceof Error ? error.message : "操作に失敗しました",
      );
    }
  }

  if (isLoading) {
    return <p className="px-4 py-8 text-sm text-zinc-500">読み込み中...</p>;
  }

  if (bookmarks.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-zinc-500">
        ブックマークした記事はありません。🔖を押すと、ここに保存されます
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col px-4">
        {bookmarks.map((bookmark) => {
          const article: Article = {
            id: bookmark.articleId,
            title: bookmark.title,
            path: bookmark.path,
            publishedAt: bookmark.publishedAt,
            author: {
              name: bookmark.authorName,
              avatarUrl: bookmark.authorAvatarUrl,
            },
          };

          return (
            <li key={bookmark.articleId}>
              <ArticleCard
                article={article}
                isRead={false}
                isBookmarked
                onToggleBookmark={() => handleRemove(bookmark.articleId)}
              />
            </li>
          );
        })}
      </ul>
      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </div>
  );
}
