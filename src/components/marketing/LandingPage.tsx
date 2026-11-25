import { Bookmark, CheckCircle2, Newspaper, Tag } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: Tag,
    title: "トピックを選ぶ",
    description: "トピックから、気になる技術をいくつでも登録できます。",
  },
  {
    icon: Newspaper,
    title: "最新記事をまとめて確認",
    description:
      "登録したトピックの最新記事を、公開日時の新しい順に一覧表示します。",
  },
  {
    icon: CheckCircle2,
    title: "NEW / READ",
    description: "読んだ記事は自動でREADへ移動。未読の記事が一目でわかります。",
  },
  {
    icon: Bookmark,
    title: "BOOKMARK",
    description: "気になる記事を保存できます（最大100件）。",
  },
];

const NOT_INCLUDED = [
  "記事の投稿はできません",
  "コメント機能はありません",
  "SNS的なフォロー・いいね機能はありません",
  "記事本文の転載はしません",
];

export function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-400">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold">Zenn News</span>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-zinc-600 transition-colors hover:text-black"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-black px-4 py-2 text-white transition-colors hover:bg-zinc-800"
            >
              新規登録
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4">
        {/* Hero */}
        <section className="flex flex-col gap-6 py-20 sm:py-28">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            興味のあるトピックだけを、
            <br />
            効率よく追う。
          </h1>
          <p className="max-w-md text-base text-zinc-600 sm:text-lg">
            トピックから好きなものを選ぶだけ。Zennの新着記事を、自分専用のニュースフィードで。
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/signup"
              className="rounded-full bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800"
            >
              はじめる →
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-zinc-300 px-6 py-3 font-medium transition-colors hover:border-zinc-400"
            >
              ログイン
            </Link>
          </div>
          <p className="text-sm text-zinc-600">
            ※本アプリはZenn公式とは関係ありません。Zennの非公式APIを利用した非公式アプリです。
          </p>
        </section>

        {/* Features */}
        <section className="flex flex-col gap-8 border-t border-zinc-400 py-20">
          <p className="text-sm font-semibold tracking-[0.2em] text-zinc-600">
            FEATURES
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-xl border border-zinc-400 p-6 transition-colors hover:border-zinc-300"
              >
                <Icon className="h-6 w-6" />
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-zinc-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Difference */}
        <section className="flex flex-col gap-6 border-t border-zinc-400 py-20">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Zennとの違い</h2>
            <p className="text-sm text-zinc-600">
              Zennの記事を読むための、もう一つの入口。
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-zinc-400 p-6">
            <ul className="flex flex-col gap-2 text-sm text-zinc-500">
              {NOT_INCLUDED.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-zinc-400">✕</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center gap-2 border-t border-zinc-400 pt-4 text-sm font-medium">
              <span>✓</span>
              登録したトピックの新着だけを、効率よく追えます
            </div>
          </div>
        </section>
      </main>

      {/* Closing CTA */}
      <section className="bg-black px-4 py-20 text-center text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
          <p className="text-2xl font-bold sm:text-3xl">
            あなたの技術ニュースを、今日から始めよう。
          </p>
          <Link
            href="/signup"
            className="rounded-full bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-zinc-200"
          >
            はじめる →
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-400 px-4 py-6 text-center text-xs text-zinc-400">
        <p>
          記事の出典：
          <a
            href="https://zenn.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Zenn
          </a>
        </p>
        <p>本アプリは Zenn 公式とは関係ありません</p>
      </footer>
    </div>
  );
}
