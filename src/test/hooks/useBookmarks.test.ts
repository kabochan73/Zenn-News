import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useBookmarks } from "@/hooks/useBookmarks";
import { createQueryClientWrapper } from "@/test/utils/queryClientWrapper";

function mockFetchResponse(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })),
  );
}

const BOOKMARK = {
  articleId: 1,
  path: "/someone/articles/test",
  title: "テスト記事",
  authorName: "著者",
  authorAvatarUrl: null,
  publishedAt: "2026-11-24T00:00:00.000Z",
  bookmarkedAt: "2026-11-24T00:01:00.000Z",
};

describe("useBookmarks", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("ブックマーク一覧を取得する", async () => {
    mockFetchResponse({ bookmarks: [BOOKMARK] });

    const { result } = renderHook(() => useBookmarks(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.bookmarks).toEqual([BOOKMARK]);
  });

  it("addBookmarkで追加したブックマークが一覧に反映される", async () => {
    mockFetchResponse({ bookmarks: [] });

    const { result } = renderHook(() => useBookmarks(), {
      wrapper: createQueryClientWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockFetchResponse({ bookmark: BOOKMARK }, 201);
    await act(async () => {
      await result.current.addBookmark({
        articleId: BOOKMARK.articleId,
        path: BOOKMARK.path,
        title: BOOKMARK.title,
        authorName: BOOKMARK.authorName,
        authorAvatarUrl: BOOKMARK.authorAvatarUrl,
        publishedAt: BOOKMARK.publishedAt,
      });
    });

    await waitFor(() => expect(result.current.bookmarks).toEqual([BOOKMARK]));
  });

  it("removeBookmarkで解除したブックマークが一覧から消える", async () => {
    mockFetchResponse({ bookmarks: [BOOKMARK] });

    const { result } = renderHook(() => useBookmarks(), {
      wrapper: createQueryClientWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockFetchResponse({ ok: true });
    await act(async () => {
      await result.current.removeBookmark(BOOKMARK.articleId);
    });

    await waitFor(() => expect(result.current.bookmarks).toEqual([]));
  });

  it("上限エラーのときはエラーがthrowされる", async () => {
    mockFetchResponse({ bookmarks: [] });

    const { result } = renderHook(() => useBookmarks(), {
      wrapper: createQueryClientWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockFetchResponse(
      { error: "ブックマークは100件までです。いくつか外してください" },
      400,
    );

    await expect(
      result.current.addBookmark({
        articleId: 999,
        path: "/x",
        title: "x",
        authorName: "x",
        authorAvatarUrl: null,
        publishedAt: "2026-11-24T00:00:00.000Z",
      }),
    ).rejects.toThrow("ブックマークは100件までです。いくつか外してください");
  });
});
