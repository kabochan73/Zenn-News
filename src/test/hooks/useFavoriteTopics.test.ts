import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useFavoriteTopics } from "@/hooks/useFavoriteTopics";
import { createQueryClientWrapper } from "@/test/utils/queryClientWrapper";

function mockFetchResponse(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })),
  );
}

describe("useFavoriteTopics", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("お気に入りトピックを取得する", async () => {
    mockFetchResponse({ favoriteTopics: ["nextjs", "react"] });

    const { result } = renderHook(() => useFavoriteTopics(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.favoriteTopics).toEqual(["nextjs", "react"]);
  });

  it("saveで保存した内容がキャッシュに反映される", async () => {
    mockFetchResponse({ favoriteTopics: [] });

    const { result } = renderHook(() => useFavoriteTopics(), {
      wrapper: createQueryClientWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockFetchResponse({ favoriteTopics: ["typescript"] });
    await act(async () => {
      await result.current.save(["typescript"]);
    });

    await waitFor(() =>
      expect(result.current.favoriteTopics).toEqual(["typescript"]),
    );
  });

  it("保存エラー時はsaveErrorにメッセージが入る", async () => {
    mockFetchResponse({ favoriteTopics: [] });

    const { result } = renderHook(() => useFavoriteTopics(), {
      wrapper: createQueryClientWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockFetchResponse({ error: "トピックを1つ以上選んでください" }, 400);
    await act(async () => {
      await expect(result.current.save([])).rejects.toThrow(
        "トピックを1つ以上選んでください",
      );
    });

    await waitFor(() =>
      expect(result.current.saveError?.message).toBe(
        "トピックを1つ以上選んでください",
      ),
    );
  });
});
