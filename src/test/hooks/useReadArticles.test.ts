import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useReadArticles } from "@/hooks/useReadArticles";
import { createQueryClientWrapper } from "@/test/utils/queryClientWrapper";

function mockFetchResponse(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })),
  );
}

describe("useReadArticles", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("既読記事IDを取得する", async () => {
    mockFetchResponse({ readArticleIds: [1, 2, 3] });

    const { result } = renderHook(() => useReadArticles(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.readArticleIds).toEqual([1, 2, 3]);
  });

  it("markAsReadを呼ぶと、既読記事IDが楽観的に即時反映される", async () => {
    mockFetchResponse({ readArticleIds: [1] });

    const { result } = renderHook(() => useReadArticles(), {
      wrapper: createQueryClientWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockFetchResponse({ ok: true }, 201);
    act(() => {
      result.current.markAsRead(2);
    });

    await waitFor(() => expect(result.current.readArticleIds).toContain(2));
  });
});
