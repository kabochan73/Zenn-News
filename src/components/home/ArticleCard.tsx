import { Bookmark } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { Article } from "@/types/article";

type ArticleCardProps = {
  article: Article;
  isRead: boolean;
  isBookmarked: boolean;
  onOpen?: () => void;
  onToggleBookmark?: () => void;
};

export function ArticleCard({
  article,
  isRead,
  isBookmarked,
  onOpen,
  onToggleBookmark,
}: ArticleCardProps) {
  return (
    <div
      className={`flex items-start justify-between gap-3 border-b border-zinc-200 py-3 ${
        isRead ? "opacity-60" : ""
      }`}
    >
      <a
        href={`https://zenn.dev${article.path}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onOpen}
        className="flex flex-1 flex-col gap-1"
      >
        <p className="line-clamp-3 text-sm font-medium">{article.title}</p>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          {article.author.avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- 著者アイコンは任意の外部ドメインのため next/image を使わない
            <img
              src={article.author.avatarUrl}
              alt=""
              className="h-5 w-5 rounded-full"
            />
          )}
          <span>{article.author.name}</span>
          <span>・{formatDateTime(article.publishedAt)}</span>
        </div>
      </a>
      <button
        type="button"
        onClick={onToggleBookmark}
        aria-label={isBookmarked ? "ブックマークを解除" : "ブックマークする"}
        className="shrink-0 text-black"
      >
        <Bookmark
          className="h-5 w-5"
          fill={isBookmarked ? "currentColor" : "none"}
        />
      </button>
    </div>
  );
}
