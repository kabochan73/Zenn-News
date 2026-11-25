import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/auth/LoginForm";

const push = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

function mockFetchResponse(body: unknown, status: number) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })),
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    push.mockClear();
    refresh.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("ログイン成功時は / へ遷移する", async () => {
    mockFetchResponse({ username: "testuser" }, 200);

    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText("ユーザー名"), "testuser");
    await userEvent.type(screen.getByLabelText("パスワード"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "ログイン" }));

    expect(push).toHaveBeenCalledWith("/");
    expect(refresh).toHaveBeenCalled();
  });

  it("ログイン失敗時はエラーメッセージを表示し、遷移しない", async () => {
    mockFetchResponse({ error: "ユーザー名またはパスワードが違います" }, 401);

    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText("ユーザー名"), "testuser");
    await userEvent.type(screen.getByLabelText("パスワード"), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: "ログイン" }));

    expect(
      await screen.findByText("ユーザー名またはパスワードが違います"),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
