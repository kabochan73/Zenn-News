# データモデル（DB設計）

[← 目次に戻る](README.md)

旧版はブラウザの localStorage に個人データを保存していたが、今回は複数ユーザーがそれぞれ自分のデータを持つため、Vercel Postgres（Neon）に保存する。ORM は Drizzle を使う（[技術スタック](09-tech-stack.md) 参照）。

## テーブル定義

### `users`

| カラム | 型 | 制約 | 内容 |
|---|---|---|---|
| `id` | uuid | PK, default `gen_random_uuid()` | ユーザーID |
| `username` | text | UNIQUE NOT NULL | ログインに使うユーザー名 |
| `password_hash` | text | NOT NULL | bcryptでハッシュ化したパスワード |
| `favorite_topics` | jsonb | NOT NULL, default `'[]'` | お気に入りトピックのslugを**選んだ順**に並べた配列 |
| `created_at` | timestamp | default `now()` | 登録日時 |

### `bookmarks`

| カラム | 型 | 制約 | 内容 |
|---|---|---|---|
| `id` | uuid | PK, default `gen_random_uuid()` | ブックマークID |
| `user_id` | uuid | FK → `users.id`, ON DELETE CASCADE | 所有者 |
| `article_id` | integer | NOT NULL | Zenn記事ID |
| `path` | text | NOT NULL | Zenn記事への相対パス（リンク生成用） |
| `title` | text | NOT NULL | 記事タイトル（スナップショット） |
| `author_name` | text | NOT NULL | 著者名（スナップショット） |
| `author_avatar_url` | text | | 著者アイコンURL（スナップショット） |
| `published_at` | timestamp | NOT NULL | 記事の公開日時（スナップショット） |
| `bookmarked_at` | timestamp | default `now()` | ブックマークした日時 |

- `UNIQUE(user_id, article_id)`：同じ記事を同じユーザーが2回ブックマークできないようにする
- 1ユーザーあたり100件の上限は、Route Handler側で `INSERT` 前に件数を数えてチェックする（DB制約ではなくアプリ側で実装する）
- 記事カードの表示に必要な情報をスナップショットとして保持することで、元記事がZennの最新30件から外れてもBOOKMARKタブで見られるようにする

### `read_articles`

| カラム | 型 | 制約 | 内容 |
|---|---|---|---|
| `user_id` | uuid | FK → `users.id`, ON DELETE CASCADE | ユーザー |
| `article_id` | integer | NOT NULL | Zenn記事ID |
| `read_at` | timestamp | default `now()` | 既読にした日時 |

- `PRIMARY KEY (user_id, article_id)`：同じ記事を2回既読にしても1行のまま
- 記事のタイトルなどは保存しない（既読かどうかの判定にしか使わないため、article_idだけで十分）

## クエリパターン

個人データへのクエリはすべて `/api/me/**` の Route Handler 経由で行う（Server Componentから直接DBを読むのは認証系の処理のみ）。クライアントからは `hooks/useFavoriteTopics`・`useReadArticles`・`useBookmarks`（TanStack Query）がこれらのAPIを呼ぶ（詳細は [フロントエンド・バックエンドの構成](10-structure.md)）。

| API | 操作 | クエリ |
|---|---|---|
| `GET /api/me/read-articles` | 既読記事ID一覧の取得 | ログイン中ユーザーの `read_articles` から `article_id` を全件取得 |
| `POST /api/me/read-articles` | 既読にする | `read_articles` に `(user_id, article_id)` をINSERT（`ON CONFLICT DO NOTHING`） |
| `GET /api/me/bookmarks` | ブックマーク一覧の取得 | `bookmarks` を `user_id` で絞り込み、`bookmarked_at` 降順で取得 |
| `POST /api/me/bookmarks` | ブックマーク追加 | 件数が100件未満か確認 → `bookmarks` にINSERT |
| `DELETE /api/me/bookmarks` | ブックマーク解除 | `bookmarks` から `(user_id, article_id)` に該当する行をDELETE |
| `GET /api/me/favorite-topics` | お気に入りトピックの取得 | `users.favorite_topics` を取得 |
| `PUT /api/me/favorite-topics` | トピック設定の保存 | `users.favorite_topics` を新しい配列でUPDATE |

## マイグレーション

- Drizzle Kit（`drizzle-kit generate` / `drizzle-kit migrate`）でスキーマ変更を管理する
- 本番（Neon）へは `DATABASE_URL` を向けてマイグレーションを実行する
