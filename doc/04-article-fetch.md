# 記事の取得（ISR）

[← 目次に戻る](README.md)

## 仕様

| 項目 | 仕様 |
|---|---|
| 取得元 | Zenn 非公式 API `GET https://zenn.dev/api/articles?topicname={slug}&order=latest&count=100` |
| User-Agent | `ZennNews/1.0 (+https://github.com/<ユーザー名>/<リポジトリ名>)`。アクセス元と連絡先が Zenn 側から分かるようにする |
| 取得件数 | トピックごとに最新100件 |
| 記事の種類 | Tech と Idea の両方 |
| 呼び出し場所 | `/topics/[slug]` の Server Component から、`lib/zenn.ts` の関数経由で呼ぶ（自分のAPI経由にしない） |
| 更新方式 | 決まった時刻に一括取得する処理はしない。Next.js 16 の Cache Components（`'use cache'` ＋ `cacheLife()`）に任せる。ページ自体がCookie・DBを読まないため、ページ全体を全ユーザー共通のHTMLとしてキャッシュできる |
| 更新の仕組み | `lib/zenn.ts` の記事取得関数に `'use cache'` を付け、`cacheLife('days')`（`revalidate`＝1日）を設定する。キャッシュが古くなった後にアクセスがあると、裏側で再取得しつつ古い結果を返す（stale-while-revalidate、仕組みは従来のISRと同じ） |
| 更新間隔 | 1日（`cacheLife('days')`の`revalidate`）。もっと早く反映したくなった場合は短い`cacheLife`に変える |
| 失敗時 | そのトピックのページ表示は失敗扱いにする（[画面](05-screens.md#読み込み中エラー) を参照） |
| 保存 | 記事そのものは保存しない（表示のたびにZenn APIの結果を使う）。ブックマークした記事だけ、スナップショットをDBにコピーして保持する（[データモデル](06-data-model.md)） |

## ビルド時に全トピックを静的化する（`generateStaticParams`）

今回インストールされているNext.js 16では、素の`'use cache'`はサーバーレス環境（Vercel）だとリクエスト間でキャッシュが保持されない場合がある（インスタンスが使い捨てのため）。確実にキャッシュさせるには、ビルド時に静的ページとして生成する必要がある。

トピックは41個の固定リストなので、`app/topics/[slug]/page.tsx`で`generateStaticParams()`が`lib/topics.ts`の全41トピックのslugを返すようにし、ビルド時に41ページすべてを静的化する。これにより、`'use cache'`の結果が通常のISRキャッシュと同じ仕組みで保持され、`cacheLife`の`revalidate`に従って更新される。

トピックは管理画面を作らずコードで固定する方針（[機能要件](02-features.md#トピック)）なので、未知のslugへのアクセスはページ内で`getTopicBySlug`の結果を見て`notFound()`を呼び404にする。`dynamicParams`ルートセグメント設定はCache Components有効時は使えないため、コード側のチェックだけで対応する。

## 既読・ブックマーク状態の反映（クライアント側）

`/topics/[slug]` のページ自体はISRで全ユーザー共通のHTMLとしてキャッシュするため、ページの中（Server Component）では個人データ（既読・ブックマーク）を取得しない。認証チェックは `proxy.ts` が行う（[フロントエンド・バックエンドの構成](10-structure.md#認証middlewareとisrの関係) 参照）。

既読・ブックマークの反映はクライアント側で行う。

1. Server ComponentがZenn APIから記事一覧を取得（ISRでキャッシュ）し、`ArticleList`（Client Component）に渡す
2. `ArticleList` 側で `useReadArticles`・`useBookmarks`（TanStack Query）が `/api/me/read-articles`・`/api/me/bookmarks` を呼び、ログイン中ユーザーの既読記事ID・ブックマークを取得する
3. 取得できた時点で、記事一覧に既読・🔖の状態を重ねて表示を更新する

TanStack Queryが取得結果をクライアント側にキャッシュするため、トピックを切り替えても（キャッシュが新しい間は）DBへ再度問い合わせない。切り替え回数が多いユーザーが増えても、DB負荷がそれに比例して増えないようにする狙いがある（Server Component側で毎リクエスト合成する設計も検討したが、トピック切り替えのたびにDBへ問い合わせが発生するため見送った。詳細は [技術スタック](09-tech-stack.md#検討したが採用しなかった技術) 参照）。

トレードオフとして、ページが表示された直後の一瞬は全記事がNEW扱いで表示され、`useReadArticles`・`useBookmarks` の取得が完了した時点でREAD/BOOKMARKの表示に切り替わることがある（旧版のlocalStorage版と同じ挙動で、今回もこれを許容する）。

## なぜ記事データ自体をDBに保存しないか

Zenn側に記事データの正本があり、新しい記事は増え続けるため、全件を保存・同期する仕組み（バッチ処理・削除ルール）を作る必要がない。`cacheLife`の`revalidate`だけで「古くなったら裏側で取り直す」が実現できる。ブックマークだけは、元記事が最新100件から外れた後も見られる必要があるため、カード表示に必要な情報だけをDBにコピーする。

## 取り込むトピック一覧（41個）

定義は `src/lib/topics.ts` に置く（旧版の42トピックからGitHub Actionsを除いた41トピックを踏襲）。

### カテゴリ別（トピック設定画面での表示順）

| カテゴリ | トピック（Zenn のトピック名） |
|---|---|
| 開発言語（10） | TypeScript（`typescript`）、JavaScript（`javascript`）、HTML（`html`）、CSS（`css`）、PHP（`php`）、Python（`python`）、Go（`go`）、Rust（`rust`）、Java（`java`）、Ruby（`ruby`） |
| フレームワーク・ライブラリ（8） | Node.js（`nodejs`）、Laravel（`laravel`）、Next.js（`nextjs`）、React（`react`）、Vue.js（`vue`）、Nuxt.js（`nuxt`）、NestJS（`nestjs`）、Rails（`rails`） |
| インフラ・クラウド（10） | AWS（`aws`）、Google Cloud（`gcp`）、Azure（`azure`）、Docker（`docker`）、Kubernetes（`kubernetes`）、Terraform（`terraform`）、Vercel（`vercel`）、Cloudflare（`cloudflare`）、Linux（`linux`）、Network（`network`） |
| データベース（2） | DB（`db`）、SQL（`sql`） |
| AI（3） | Claude（`claude`）、ChatGPT（`chatgpt`）、Gemini（`gemini`） |
| デザイン（3） | デザイン（`design`）、UI（`ui`）、UX（`ux`） |
| その他（5） | セキュリティ（`security`）、Git（`git`）、テスト（`test`）、アルゴリズム（`algorithm`）、AtCoder（`atcoder`） |

投稿が多すぎる `ai` タグや `claudecode` タグは含めない（AI関連はClaude・ChatGPT・Geminiの3トピックで扱う）。投稿がほぼない・少ないトピック（Svelte、Angular、Redis、Firebase 等）も含めない。

※ `db`（DB）と `database`（Database）は Zenn 上では別のトピック。`db` を使う。

## 外部APIへの配慮

- Zennへのアクセスは、キャッシュが切れたときにアクセスがあった場合のみ発生する（決まった時刻に全トピックを一括取得することはしない）
- 複数ユーザーが同じトピックを見ても、キャッシュが共有されるためZennへのリクエストが増えるわけではない（ユーザー数が増えてもZenn APIへの負荷はほぼ変わらない）
- 記事は必ずZennの元ページへリンクし、出典を明記する（[非機能要件](07-non-functional.md) を参照）
