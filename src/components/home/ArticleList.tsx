"use client";

import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/home/ArticleCard";
import { HomeTabs, type Tab } from "@/components/home/HomeTabs";
import { Toast } from "@/components/ui/Toast";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useReadArticles } from "@/hooks/useReadArticles";
import type { Article } from "@/types/article";

type ArticleListProps = {
  articles: Article[];
};

const EMPTY_MESSAGE: Record<Tab, string> = {
  new: "新着記事はありません",
  read: "まだ読んだ記事はありません",
  bookmark: "ブックマークした記事はありません。🔖を押すと、ここに保存されます",
};

export function ArticleList({ articles }: ArticleListProps) {
  const [tab, setTab] = useState<Tab>("new");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { readArticleIds, markAsRead } = useReadArticles();
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();

  const readIdSet = useMemo(() => new Set(readArticleIds), [readArticleIds]);
  const bookmarkedIdSet = useMemo(
    () => new Set(bookmarks.map((bookmark) => bookmark.articleId)),
    [bookmarks],
  );

  const newArticles = articles.filter((article) => !readIdSet.has(article.id));
  const readArticlesList = articles.filter((article) =>
    readIdSet.has(article.id),
  );
  const bookmarkArticles: Article[] = bookmarks.map((bookmark) => ({
    id: bookmark.articleId,
    title: bookmark.title,
    path: bookmark.path,
    publishedAt: bookmark.publishedAt,
    author: {
      name: bookmark.authorName,
      avatarUrl: bookmark.authorAvatarUrl,
    },
  }));

  const counts: Record<Tab, number> = {
    new: newArticles.length,
    read: readArticlesList.length,
    bookmark: bookmarkArticles.length,
  };

  const visibleArticles =
    tab === "new"
      ? newArticles
      : tab === "read"
        ? readArticlesList
        : bookmarkArticles;

  async function handleToggleBookmark(article: Article) {
    try {
      if (bookmarkedIdSet.has(article.id)) {
        await removeBookmark(article.id);
        return;
      }

      await addBookmark({
        articleId: article.id,
        path: article.path,
        title: article.title,
        authorName: article.author.name,
        authorAvatarUrl: article.author.avatarUrl,
        publishedAt: article.publishedAt,
      });
    } catch (error) {
      setToastMessage(
        error instanceof Error ? error.message : "操作に失敗しました",
      );
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <HomeTabs selected={tab} onSelect={setTab} counts={counts} />
      {visibleArticles.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-zinc-500">
          {EMPTY_MESSAGE[tab]}
        </p>
      ) : (
        <ul className="flex flex-col px-4">
          {visibleArticles.map((article) => (
            <li key={article.id}>
              <ArticleCard
                article={article}
                isRead={tab === "read"}
                isBookmarked={bookmarkedIdSet.has(article.id)}
                onOpen={() => markAsRead(article.id)}
                onToggleBookmark={() => handleToggleBookmark(article)}
              />
            </li>
          ))}
        </ul>
      )}
      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </div>
  );
}
