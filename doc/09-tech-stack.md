# 技術スタック詳細

[← 目次に戻る](README.md)

バージョンは実装時点（2026年頃）の最新安定版を基準にする。実際にインストールされたバージョンは `package.json` を参照。

## フロントエンド

| 項目 | 採用技術 | 備考 |
|---|---|---|
| 実行環境 | Node.js | LTS |
| パッケージマネージャー | npm | |
| フレームワーク | Next.js 16（App Router、Cache Components） | 記事データは`'use cache'`＋`cacheLife`＋`generateStaticParams`でページ全体をキャッシュ・更新する（従来のISR相当。詳細は [記事の取得](04-article-fetch.md)） |
| UIライブラリ | React | |
| 言語 | TypeScript | |
| スタイル | Tailwind CSS | |
| UI部品 | 自作 | UI部品ライブラリは使わない |
| データ取得・キャッシュ | TanStack Query | 記事データはNext.jsのISRでキャッシュ（全ユーザー共通）。既読・ブックマーク・お気に入りトピックは`/api/me/**`経由でTanStack Queryがクライアント側で取得・キャッシュする。トピックを何度切り替えても（staleTime内は）DBへ再問い合わせしないため、切り替え頻度が高いユーザーが増えてもDB負荷が比例して増えない |
| コードチェック | ESLint | |
| コード整形 | Prettier | |

## バックエンド・DB

| 項目 | 採用技術 | 備考 |
|---|---|---|
| APIの実装場所 | Next.js Route Handler（`app/api/**/route.ts`） | 専用サーバーは立てない |
| DB | Vercel Postgres（Neon） | サーバーレスで無料枠あり、ハッカソン向き |
| DBドライバ | `@neondatabase/serverless` | NeonのHTTP経由ドライバ。Edge/サーバーレス関数から高速に接続できる |
| ORM | Drizzle ORM（`drizzle-orm/neon-http`） | 型安全なクエリ、セットアップが軽量。Drizzle Kitでマイグレーション管理 |
| パスワードハッシュ | bcryptjs | pure JS実装のため、Node runtimeのRoute Handlerでネイティブビルド不要で動く |
| 認証セッション | jose（JWTの発行・検証） ＋ Next.js Middleware | 詳細は [認証](03-auth.md) |

## テスト

| 種類 | 採用技術 |
|---|---|
| フロントエンド（コンポーネント・ロジック） | Vitest ＋ React Testing Library |

## インフラ

| 項目 | 採用技術 | 備考 |
|---|---|---|
| ホスティング | Vercel | Next.jsのfetchキャッシュをそのまま使える |
| DBホスティング | Neon（Vercel Postgres経由） | |
| CI | GitHub Actions | ESLint・テスト・ビルド |

## 検討したが採用しなかった技術

| 技術 | 理由 |
|---|---|
| Server Componentでの既読・ブックマーク合成 | 当初はServer Component内でDBクエリとZenn APIの結果を合成する設計を検討したが、トピック切り替えのたびに（ページ遷移＝サーバーリクエストのたびに）DBへ問い合わせが発生し、切り替え回数が多いユーザーが増えるとDB負荷がそれに比例して増えてしまう。クライアント側でTanStack Queryがキャッシュする方式に変更した |
| Auth.js（NextAuth） | OAuthは使わず、ユーザー名＋パスワードのシンプルな認証のみのため、自前のbcrypt＋jose実装で十分と判断した |
| Prisma | Drizzleの方が軽量でコールドスタートが速く、Neonとの組み合わせでの実績も多いため |
