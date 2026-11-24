# インフラ・開発運用

[← 目次に戻る](README.md)

## 開発環境

```
npm run dev
 └── frontend … Next.js（localhost:3000）
      └── DB … Neon（開発用プロジェクトを別途作成、DATABASE_URL をローカルの .env.local に設定）
```

バックエンド専用サーバーは立てない。DBはNeonのクラウド上のものをローカル開発からも直接使う（コンテナでのローカルDBは用意しない）。

## 本番環境（Vercel）

```
インターネット
   │
   ▼
Vercel（Next.js）
   │         │
   │         ▼
   │      Neon（Vercel Postgres）
   ▼
Zenn API（https://zenn.dev/api/articles）
```

- Next.jsとVercelの組み合わせで、fetchキャッシュ（`revalidate`）がそのまま使える
- DBはVercelのMarketplace経由でNeonプロジェクトを作成し接続する（Vercel Postgres）
- Cronは使わない。DB更新はユーザー操作（既読・ブックマーク・トピック設定の保存）のタイミングで発生する

### 環境変数

| 変数 | 内容 |
|---|---|
| `DATABASE_URL` | Neon（Vercel Postgres）の接続文字列 |
| `AUTH_SECRET` | JWTの署名に使う秘密鍵（ランダムな文字列） |

Vercelのプロジェクト設定で、Production（必要ならPreviewにも）に設定する。

### 決まった時刻に記事を更新したくなった場合（今回は使わない）

fetchキャッシュの`revalidate`はアクセスがあったときにしか更新されないため、「アクセスがなくても決まった時刻に更新したい」という要望が出た場合は、次の方法が使える。今回はスコープ外とする。

| 方法 | 内容 |
|---|---|
| Vercel Cron Jobs | `vercel.json` に `crons` を設定し、`/api/revalidate` のようなRoute Handlerを定期的に呼び出して`revalidateTag`する |

## リポジトリ・CI/CD

- GitHubの単一リポジトリ（新規作成）
- ブランチは切らず、`main` に直接pushする
- pushのたびにGitHub Actions（`.github/workflows/ci.yml`）でESLint・テスト（Vitest）・ビルド（型チェックを含む）を実行する
- `main`へのpushでVercelが自動デプロイする（GitHub連携）
- マイグレーション（Drizzle Kit）はデプロイ前に手動で本番DBに対して実行する（CIに組み込むかは実装時に判断する）

## テスト

| 種類 | ツール | 対象 |
|---|---|---|
| フロントエンド | Vitest ＋ React Testing Library | 認証ロジック（パスワードハッシュ・JWT発行検証、特に改ざんトークンの拒否）、トピック選択・記事カードなどのコンポーネント |

E2Eテスト（Playwright）は作らない。画面の流れは手動で確認し、問題が見つかったらその都度直す。

## ハッカソンでの公開に向けた確認

- 複数ユーザーでサインアップし、既読・ブックマーク・お気に入りトピックが互いに独立していることを本番URLで確認する
- 初めて開いたユーザーが迷わずサインアップ→トピック選択→記事一覧まで進めるか確認する
