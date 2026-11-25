# Zenn News

Zenn の記事を、自分の好きなトピックだけ「最新順」で読めるパーソナルニュースアプリです。誰でもアカウントを作って使えます。

🔗 **本番URL**: https://zenn-news.vercel.app/
📄 **設計資料**: [doc/](doc/README.md)

## これは何

Zenn には1日に数百件の記事が投稿されており、すべてを読むことはできません。
Zenn News は「全部読む」のではなく、**自分に関係のあるトピックだけを、自分のペースで追う**ためのアプリです。

- トピック（言語・フレームワーク・クラウドなど）をお気に入り登録すると、そのトピックの最新記事がニュースの見出しのように並びます
- 読んだ記事は自動で既読になり、気になる記事はブックマークできます
- 既読・ブックマーク・お気に入りトピックはユーザーごとにDBで管理され、他人のデータは見えません

## 主な機能

| 機能 | 内容 |
|---|---|
| サインアップ・ログイン | ユーザー名＋パスワードのみ（メール認証・OAuth不要） |
| トピック選択 | カテゴリ別に複数選択可能。選んだ順に表示される |
| ニュースフィード | トピックごとに最新30件を取得し、NEW / READ / BOOKMARK タブで表示 |
| 既読管理 | 記事を開くと自動で既読になる |
| ブックマーク | 記事をブックマーク（最大100件） |

## 技術構成

| 領域 | 技術 |
|---|---|
| フレームワーク | Next.js 16（App Router / Cache Components） |
| 言語 | TypeScript |
| スタイル | Tailwind CSS |
| データ取得・キャッシュ | TanStack Query |
| DB | Neon（Vercel Postgres） |
| ORM | Drizzle ORM |
| 認証 | bcryptjs（パスワードハッシュ）＋ jose（JWT）／httpOnly Cookie |
| テスト | Vitest ＋ React Testing Library |
| デプロイ | Vercel（GitHub連携で自動デプロイ） |
| CI | GitHub Actions（Lint・テスト・ビルド） |
| 記事データ | Zenn 非公式API（`https://zenn.dev/api/articles`） |

設計の詳細は [doc/](doc/README.md) にまとめています。

## ローカルでの動かし方

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env.local` を作成し、値を設定します。

```bash
cp .env.example .env.local
```

| 変数 | 内容 |
|---|---|
| `DATABASE_URL` | Neon（Postgres）の接続文字列 |
| `AUTH_SECRET` | JWTの署名に使うランダムな文字列 |

### 3. DBマイグレーション

```bash
npm run db:generate
npm run db:migrate
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開くと確認できます。

## その他のコマンド

```bash
npm run lint          # ESLint
npm run test          # Vitest
npm run build          # 本番ビルド
npm run format         # Prettierでフォーマット
```

## ディレクトリ構成

```
src/
├── app/            ルーティング（App Router）
├── components/     UIコンポーネント
├── hooks/          TanStack Queryのカスタムフック
├── lib/            DB・認証・Zenn API連携などのロジック
└── proxy.ts        未ログイン時のリダイレクト（旧Middleware）
doc/                設計資料（詳細な仕様・設計判断の記録）
```
