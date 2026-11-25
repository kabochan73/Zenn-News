import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ArticleCard } from "@/components/home/ArticleCard";
import type { Article } from "@/types/article";

const ARTICLE: Article = {
  id: 1,
  title: "テスト記事タイトル",
  path: "/someone/articles/test-article",
  publishedAt: "2026-11-24T05:00:00.000Z",
  author: { name: "テスト著者", avatarUrl: null },
};

describe("ArticleCard", () => {
  it("記事タイトルと著者名を表示する", () => {
    render(
      <ArticleCard article={ARTICLE} isRead={false} isBookmarked={false} />,
    );
    expect(screen.getByText("テスト記事タイトル")).toBeInTheDocument();
    expect(screen.getByText("テスト著者")).toBeInTheDocument();
  });

  it("Zennの記事ページへ新しいタブで開くリンクになっている", () => {
    render(
      <ArticleCard article={ARTICLE} isRead={false} isBookmarked={false} />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      "https://zenn.dev/someone/articles/test-article",
    );
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("既読のときは薄く表示される", () => {
    const { container } = render(
      <ArticleCard article={ARTICLE} isRead={true} isBookmarked={false} />,
    );
    expect(container.firstChild).toHaveClass("opacity-60");
  });

  it("ブックマーク済みのときはアイコンが塗りつぶしになる", () => {
    render(
      <ArticleCard article={ARTICLE} isRead={false} isBookmarked={true} />,
    );
    const icon = document.querySelector("svg.lucide-bookmark");
    expect(icon).toHaveAttribute("fill", "currentColor");
  });

  it("未ブックマークのときはアイコンが枠線のみになる", () => {
    render(
      <ArticleCard article={ARTICLE} isRead={false} isBookmarked={false} />,
    );
    const icon = document.querySelector("svg.lucide-bookmark");
    expect(icon).toHaveAttribute("fill", "none");
  });

  it("記事リンクをクリックするとonOpenが呼ばれる", async () => {
    const onOpen = vi.fn();
    render(
      <ArticleCard
        article={ARTICLE}
        isRead={false}
        isBookmarked={false}
        onOpen={onOpen}
      />,
    );
    await userEvent.click(screen.getByRole("link"));
    expect(onOpen).toHaveBeenCalled();
  });

  it("ブックマークボタンをクリックするとonToggleBookmarkが呼ばれる", async () => {
    const onToggleBookmark = vi.fn();
    render(
      <ArticleCard
        article={ARTICLE}
        isRead={false}
        isBookmarked={false}
        onToggleBookmark={onToggleBookmark}
      />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onToggleBookmark).toHaveBeenCalled();
  });
});
