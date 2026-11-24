"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  isValidPassword,
  isValidUsername,
  PASSWORD_MIN_LENGTH,
} from "@/lib/validation";

export function SignupForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isValidUsername(username)) {
      setError("ユーザー名は3〜20文字の英数字と_で入力してください");
      return;
    }

    if (!isValidPassword(password)) {
      setError(`パスワードは${PASSWORD_MIN_LENGTH}文字以上で入力してください`);
      return;
    }

    if (password !== passwordConfirmation) {
      setError("パスワードが一致しません");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "登録に失敗しました");
      setIsSubmitting(false);
      return;
    }

    router.push("/topics?welcome=1");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm font-medium">
          ユーザー名
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="rounded border border-zinc-300 px-3 py-2"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded border border-zinc-300 px-3 py-2"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password-confirmation" className="text-sm font-medium">
          パスワード（確認用）
        </label>
        <input
          id="password-confirmation"
          name="password-confirmation"
          type="password"
          autoComplete="new-password"
          required
          value={passwordConfirmation}
          onChange={(event) => setPasswordConfirmation(event.target.value)}
          className="rounded border border-zinc-300 px-3 py-2"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        登録する
      </button>
      <a href="/login" className="text-center text-sm text-zinc-600 underline">
        すでにアカウントをお持ちの方はこちら
      </a>
    </form>
  );
}
