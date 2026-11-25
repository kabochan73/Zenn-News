import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SignupForm } from "@/components/auth/SignupForm";

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

async function fillForm({
  username,
  password,
  passwordConfirmation,
}: {
  username: string;
  password: string;
  passwordConfirmation: string;
}) {
  await userEvent.type(screen.getByLabelText("ユーザー名"), username);
  await userEvent.type(screen.getByLabelText("パスワード"), password);
  await userEvent.type(
    screen.getByLabelText("パスワード（確認用）"),
    passwordConfirmation,
  );
}

describe("SignupForm", () => {
  beforeEach(() => {
    push.mockClear();
    refresh.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("ユーザー名が不正な形式だと、APIを呼ばずにエラーを表示する", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    render(<SignupForm />);
    await fillForm({
      username: "a",
      password: "password123",
      passwordConfirmation: "password123",
    });
    await userEvent.click(screen.getByRole("button", { name: "登録する" }));

    expect(
      await screen.findByText(
        "ユーザー名は3〜20文字の英数字と_で入力してください",
      ),
    ).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("パスワードが短いとエラーを表示する", async () => {
    render(<SignupForm />);
    await fillForm({
      username: "testuser",
      password: "short",
      passwordConfirmation: "short",
    });
    await userEvent.click(screen.getByRole("button", { name: "登録する" }));

    expect(
      await screen.findByText("パスワードは8文字以上で入力してください"),
    ).toBeInTheDocument();
  });

  it("パスワードと確認用が一致しないとエラーを表示する", async () => {
    render(<SignupForm />);
    await fillForm({
      username: "testuser",
      password: "password123",
      passwordConfirmation: "password456",
    });
    await userEvent.click(screen.getByRole("button", { name: "登録する" }));

    expect(
      await screen.findByText("パスワードが一致しません"),
    ).toBeInTheDocument();
  });

  it("登録成功時は /topics?welcome=1 へ遷移する", async () => {
    mockFetchResponse({ username: "testuser" }, 201);

    render(<SignupForm />);
    await fillForm({
      username: "testuser",
      password: "password123",
      passwordConfirmation: "password123",
    });
    await userEvent.click(screen.getByRole("button", { name: "登録する" }));

    expect(push).toHaveBeenCalledWith("/topics?welcome=1");
    expect(refresh).toHaveBeenCalled();
  });

  it("登録失敗時(ユーザー名重複)はAPIのエラーメッセージを表示する", async () => {
    mockFetchResponse({ error: "そのユーザー名は既に使われています" }, 409);

    render(<SignupForm />);
    await fillForm({
      username: "testuser",
      password: "password123",
      passwordConfirmation: "password123",
    });
    await userEvent.click(screen.getByRole("button", { name: "登録する" }));

    expect(
      await screen.findByText("そのユーザー名は既に使われています"),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
