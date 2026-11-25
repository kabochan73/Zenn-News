import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TopicSelector } from "@/components/topics/TopicSelector";
import { createQueryClientWrapper } from "@/test/utils/queryClientWrapper";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh: vi.fn() }),
}));

function mockFetchSequence(
  responses: Array<{ body: unknown; status?: number }>,
) {
  const fn = vi.fn();
  for (const { body, status = 200 } of responses) {
    fn.mockResolvedValueOnce(new Response(JSON.stringify(body), { status }));
  }
  vi.stubGlobal("fetch", fn);
  return fn;
}

describe("TopicSelector", () => {
  beforeEach(() => {
    push.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("取得したお気に入りトピックが選択済み状態で表示される", async () => {
    mockFetchSequence([{ body: { favoriteTopics: ["nextjs"] } }]);

    render(<TopicSelector />, { wrapper: createQueryClientWrapper() });

    const nextjsButton = await screen.findByRole("button", {
      name: "Next.js",
    });
    expect(nextjsButton).toHaveClass("bg-black");
  });

  it("カテゴリごとの選択数が表示される", async () => {
    mockFetchSequence([{ body: { favoriteTopics: ["nextjs", "react"] } }]);

    render(<TopicSelector />, { wrapper: createQueryClientWrapper() });

    expect(await screen.findByText("2/8 選択中")).toBeInTheDocument();
  });

  it("トピックをタップすると選択状態が切り替わる", async () => {
    mockFetchSequence([{ body: { favoriteTopics: [] } }]);

    render(<TopicSelector />, { wrapper: createQueryClientWrapper() });

    const saveButton = await screen.findByRole("button", { name: "保存する" });
    expect(saveButton).toBeDisabled();

    await userEvent.click(
      await screen.findByRole("button", { name: "Next.js" }),
    );

    expect(saveButton).not.toBeDisabled();
  });

  it("保存すると選んだトピックの先頭のページへ移動する", async () => {
    const fetchMock = mockFetchSequence([
      { body: { favoriteTopics: [] } },
      { body: { favoriteTopics: ["nextjs"] } },
    ]);

    render(<TopicSelector />, { wrapper: createQueryClientWrapper() });

    await userEvent.click(
      await screen.findByRole("button", { name: "Next.js" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "保存する" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/topics/nextjs"));
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/me/favorite-topics",
      expect.objectContaining({ method: "PUT" }),
    );
  });
});
